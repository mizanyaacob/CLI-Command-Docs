import type { CliExample } from "../types/cli";

const spawnCubeSource = `// ---------------------------------------------------------------------------
// SpawnCubeCommand.cs — custom Unity CLI command "Spawn-Cube".
// Put this file in any folder named "Editor" (e.g. Assets/Editor/).
// Requires the Pipeline package:  unity pipeline install
//
//   unity command Spawn-Cube
//   unity command Spawn-Cube --name Crate --x 0 --y 1 --z 0
//   unity command Spawn-Cube --name Wall --count 5 --spacing 1.1 --size 1 --color "#F2B705"
//   unity run ./MyGame --command Spawn-Cube -- --name Crate      (one-shot, no open Editor)
// ---------------------------------------------------------------------------
using System;
using System.Collections.Generic;
using Unity.Pipeline.Commands;          // [CliCommand] / [CliArg] — from com.unity.pipeline
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

public static class SpawnCubeCommand
{
    [CliCommand("Spawn-Cube", "Create one or more cubes in the active scene",
                MainThreadRequired = true)]   // touches the scene, so it must run on the main thread
    public static string SpawnCube(
        [CliArg("name",    "Name of the cube (numbered when count > 1)")] string name = "Cube",
        [CliArg("x",       "X position of the first cube")]              float x = 0f,
        [CliArg("y",       "Y position of the first cube")]              float y = 0f,
        [CliArg("z",       "Z position of the first cube")]              float z = 0f,
        [CliArg("size",    "Uniform scale of each cube")]                float size = 1f,
        [CliArg("color",   "Hex color, e.g. #FF8800 (empty = default material)")] string color = "",
        [CliArg("count",   "How many cubes to create in a row along X (1–100)")] int count = 1,
        [CliArg("spacing", "Distance between cubes along X")]            float spacing = 1.5f)
    {
        // Validate input — thrown errors are reported back to the CLI as a failed command.
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("name must not be empty");
        if (size <= 0f)                      throw new ArgumentException("size must be greater than 0");
        if (count < 1 || count > 100)        throw new ArgumentException("count must be between 1 and 100");

        Color? tint = null;
        if (!string.IsNullOrEmpty(color))
        {
            if (!ColorUtility.TryParseHtmlString(color, out var parsed))
                throw new ArgumentException($"'{color}' is not a valid color. Use a hex value like #FF8800.");
            tint = parsed;
        }

        // Group everything into one Undo step so Ctrl+Z removes the whole batch.
        Undo.IncrementCurrentGroup();
        int undoGroup = Undo.GetCurrentGroup();

        var created = new List<GameObject>(count);
        for (int i = 0; i < count; i++)
        {
            var cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
            cube.name = count == 1 ? name : $"{name}_{i + 1}";
            cube.transform.position = new Vector3(x + i * spacing, y, z);
            cube.transform.localScale = Vector3.one * size;

            if (tint.HasValue)
            {
                // Copy the material instead of editing the shared default one,
                // otherwise every primitive in the project would change color.
                var renderer = cube.GetComponent<Renderer>();
                var mat = new Material(renderer.sharedMaterial) { name = $"{cube.name}_Mat", color = tint.Value };
                renderer.sharedMaterial = mat;
            }

            Undo.RegisterCreatedObjectUndo(cube, "Spawn-Cube");
            created.Add(cube);
        }

        Undo.CollapseUndoOperations(undoGroup);
        EditorSceneManager.MarkSceneDirty(created[0].scene);   // so "Save" picks up the change
        Selection.objects = created.ToArray();                 // highlight them in the Hierarchy

        var first = created[0].transform.position;
        return count == 1
            ? $"Spawned '{created[0].name}' at {first} in scene '{created[0].scene.name}'"
            : $"Spawned {count} cubes '{name}_1'…'{name}_{count}' starting at {first} in scene '{created[0].scene.name}'";
    }
}`;

const querySceneStatsSource = `// ---------------------------------------------------------------------------
// QuerySceneStatsCommand.cs — read-only custom command "Query-SceneStats".
// A read-only command needs none of SpawnCube's Undo/dirty/Selection ceremony —
// nothing in the scene changes, so there is nothing to make undoable.
// ---------------------------------------------------------------------------
using System.Linq;
using System.Text;
using Unity.Pipeline.Commands;
using UnityEditor.SceneManagement;
using UnityEngine;

public static class QuerySceneStatsCommand
{
    [CliCommand("Query-SceneStats", "Report GameObject, renderer and light counts for the active scene")]
    public static string QuerySceneStats(
        [CliArg("includeInactive", "Count inactive GameObjects too")] bool includeInactive = false,
        [CliArg("format", "Output format: 'text' or 'json'")]          string format = "text")
    {
        var scene = EditorSceneManager.GetActiveScene();
        var roots = scene.GetRootGameObjects();

        var all = roots.SelectMany(r => r.GetComponentsInChildren<Transform>(includeInactive))
                        .Select(t => t.gameObject)
                        .ToArray();

        int goCount = all.Length;
        int rendererCount = all.Count(g => g.GetComponent<Renderer>() != null);
        int lightCount = all.Count(g => g.GetComponent<Light>() != null);
        long triCount = all.Where(g => g.TryGetComponent<MeshFilter>(out _))
                            .Sum(g => (long)g.GetComponent<MeshFilter>().sharedMesh?.triangles.Length / 3 ?? 0);

        if (format == "json")
        {
            return $"{{\\"scene\\":\\"{scene.name}\\",\\"gameObjects\\":{goCount},\\"renderers\\":{rendererCount},\\"lights\\":{lightCount},\\"triangles\\":{triCount}}}";
        }

        var sb = new StringBuilder();
        sb.AppendLine($"Scene: {scene.name}");
        sb.AppendLine($"  GameObjects : {goCount}{(includeInactive ? "" : " (active only)")}");
        sb.AppendLine($"  Renderers   : {rendererCount}");
        sb.AppendLine($"  Lights      : {lightCount}");
        sb.AppendLine($"  Triangles   : {triCount:N0}");
        return sb.ToString();
    }
}`;

const setBuildTargetSource = `// ---------------------------------------------------------------------------
// SetBuildTargetCommand.cs — choice-argument custom command "Set-BuildTarget".
// [CliArg] has no dedicated "enum" flavor today, so a restricted choice is
// expressed as a string plus an explicit allow-list check — the same pattern
// SpawnCube uses for its hex color, just with a fixed set of valid values.
// ---------------------------------------------------------------------------
using System;
using System.Linq;
using Unity.Pipeline.Commands;
using UnityEditor;

public static class SetBuildTargetCommand
{
    static readonly (string arg, BuildTarget target)[] Targets =
    {
        ("Windows", BuildTarget.StandaloneWindows64),
        ("macOS",   BuildTarget.StandaloneOSX),
        ("Linux",   BuildTarget.StandaloneLinux64),
        ("iOS",     BuildTarget.iOS),
        ("Android", BuildTarget.Android),
        ("WebGL",   BuildTarget.WebGL),
    };

    [CliCommand("Set-BuildTarget", "Switch the active build target platform")]
    public static string SetBuildTarget(
        [CliArg("platform", "One of: Windows, macOS, Linux, iOS, Android, WebGL")] string platform = "Windows")
    {
        var match = Targets.FirstOrDefault(t => string.Equals(t.arg, platform, StringComparison.OrdinalIgnoreCase));
        if (match.arg == null)
        {
            var choices = string.Join(", ", Targets.Select(t => t.arg));
            throw new ArgumentException($"'{platform}' is not a valid platform. Choose one of: {choices}");
        }

        var group = BuildPipeline.GetBuildTargetGroup(match.target);
        EditorUserBuildSettings.SwitchActiveBuildTarget(group, match.target);
        return $"Active build target set to '{match.arg}' ({match.target})";
    }
}

// Alternative: a real C# enum reads cleaner at the call site once your CLI
// layer supports enum parameters — [CliArg] then validates membership for you
// and the --help text lists the values automatically:
//
//   public enum BuildTargetChoice { Windows, macOS, Linux, iOS, Android, WebGL }
//
//   public static string SetBuildTarget(
//       [CliArg("platform", "Target platform")] BuildTargetChoice platform = BuildTargetChoice.Windows)
//   { /* no manual allow-list needed */ }`;

const batchOptimizeTexturesSource = `// ---------------------------------------------------------------------------
// BatchOptimizeTexturesCommand.cs — longer-running batch custom command
// "Batch-OptimizeTextures". Demonstrates looping over an AssetDatabase query,
// aggregating partial failures, and returning one summary line instead of
// per-file spam — the CLI caller gets a single, scriptable result string.
// ---------------------------------------------------------------------------
using System;
using Unity.Pipeline.Commands;
using UnityEditor;

public static class BatchOptimizeTexturesCommand
{
    [CliCommand("Batch-OptimizeTextures", "Reimport textures under a folder with compression settings applied",
                MainThreadRequired = true)]
    public static string BatchOptimizeTextures(
        [CliArg("folder",  "Project-relative folder to scan")]                 string folder = "Assets/Textures",
        [CliArg("maxSize", "Max texture dimension in pixels")]                 int maxSize = 2048,
        [CliArg("dryRun",  "Report what would change without writing anything")] bool dryRun = false)
    {
        if (!AssetDatabase.IsValidFolder(folder))
            throw new ArgumentException($"'{folder}' is not a valid project folder");

        var guids = AssetDatabase.FindAssets("t:Texture2D", new[] { folder });
        int processed = 0, skipped = 0, failed = 0;

        foreach (var guid in guids)
        {
            var path = AssetDatabase.GUIDToAssetPath(guid);
            var importer = AssetImporter.GetAtPath(path) as TextureImporter;
            if (importer == null) { skipped++; continue; }

            if (importer.maxTextureSize == maxSize) { skipped++; continue; }

            try
            {
                if (!dryRun)
                {
                    importer.maxTextureSize = maxSize;
                    importer.SaveAndReimport();
                }
                processed++;
            }
            catch (Exception)
            {
                failed++;
            }
        }

        var verb = dryRun ? "Would process" : "Processed";
        return $"{verb} {processed} textures ({skipped} skipped, {failed} failed) under '{folder}'";
    }
}`;

const toggleDebugOverlaySource = `// ---------------------------------------------------------------------------
// ToggleDebugOverlayCommand.cs — settings-toggle custom command
// "Toggle-DebugOverlay". The simplest category of command: it writes an
// EditorPrefs flag, not the scene graph, so there is nothing to Undo, dirty,
// or select — not every command needs SpawnCube's full ceremony.
// ---------------------------------------------------------------------------
using Unity.Pipeline.Commands;
using UnityEditor;

public static class ToggleDebugOverlayCommand
{
    const string PrefKey = "MyGame.DebugOverlay.Enabled";

    [CliCommand("Toggle-DebugOverlay", "Enable or disable the in-scene debug stats overlay")]
    public static string ToggleDebugOverlay(
        [CliArg("enabled", "true to show the overlay, false to hide it")] bool enabled = true)
    {
        EditorPrefs.SetBool(PrefKey, enabled);
        return $"Debug overlay {(enabled ? "enabled" : "disabled")}";
    }
}`;

const getMissingReferencesSource = `// ---------------------------------------------------------------------------
// GetMissingReferencesCommand.cs — read-only scan with an environment-state
// error path (custom command "Get-MissingReferences"). Contrast with
// SpawnCube's argument-validation errors and Set-BuildTarget's choice-list
// error: this one rejects on the state of the project itself, not on args.
// ---------------------------------------------------------------------------
using System;
using System.Linq;
using System.Text;
using Unity.Pipeline.Commands;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

public static class GetMissingReferencesCommand
{
    [CliCommand("Get-MissingReferences", "Scan the active scene for components with missing script or reference fields")]
    public static string GetMissingReferences()
    {
        var scene = EditorSceneManager.GetActiveScene();
        if (string.IsNullOrEmpty(scene.path))
            throw new InvalidOperationException("Active scene has no path — save it first");

        var offenders = scene.GetRootGameObjects()
            .SelectMany(r => r.GetComponentsInChildren<Transform>(true))
            .SelectMany(t => t.GetComponents<Component>())
            .Where(c => c == null)
            .ToArray();

        if (offenders.Length == 0)
            return $"No missing script references found in '{scene.name}'";

        var sb = new StringBuilder();
        sb.AppendLine($"{offenders.Length} missing script reference(s) in '{scene.name}':");
        sb.AppendLine("  (re-run with a GameObject-path report once your project needs one)");
        return sb.ToString();
    }
}`;

const buildGameSource = `// ---------------------------------------------------------------------------
// BuildGameCommand.cs — the longest-running custom command here: "Build-Game".
// Kicks off a real BuildPipeline.BuildPlayer and reduces the result to one
// summary line — the shape a CI job wants to grep or branch on, not a wall
// of per-asset build log output.
// ---------------------------------------------------------------------------
using System;
using System.Linq;
using Unity.Pipeline.Commands;
using UnityEditor;
using UnityEditor.Build.Reporting;

public static class BuildGameCommand
{
    static readonly (string arg, BuildTarget target, BuildTargetGroup group)[] Targets =
    {
        ("Windows", BuildTarget.StandaloneWindows64, BuildTargetGroup.Standalone),
        ("macOS",   BuildTarget.StandaloneOSX,       BuildTargetGroup.Standalone),
        ("Linux",   BuildTarget.StandaloneLinux64,   BuildTargetGroup.Standalone),
        ("WebGL",   BuildTarget.WebGL,               BuildTargetGroup.WebGL),
    };

    [CliCommand("Build-Game", "Build a standalone player for the given platform", MainThreadRequired = true)]
    public static string BuildGame(
        [CliArg("platform",         "One of: Windows, macOS, Linux, WebGL")] string platform = "Windows",
        [CliArg("outputPath",       "Folder the build is written to")]        string outputPath = "Builds",
        [CliArg("developmentBuild", "Include debug symbols and the profiler")] bool developmentBuild = false)
    {
        var match = Targets.FirstOrDefault(t => string.Equals(t.arg, platform, StringComparison.OrdinalIgnoreCase));
        if (match.arg == null)
        {
            var choices = string.Join(", ", Targets.Select(t => t.arg));
            throw new ArgumentException($"'{platform}' is not a valid platform. Choose one of: {choices}");
        }

        if (string.IsNullOrWhiteSpace(outputPath))
            throw new ArgumentException("outputPath must not be empty");

        var scenes = EditorBuildSettings.scenes.Where(s => s.enabled).Select(s => s.path).ToArray();
        if (scenes.Length == 0)
            throw new InvalidOperationException("No scenes are enabled in Build Settings — nothing to build");

        var exe = match.target == BuildTarget.StandaloneWindows64 ? ".exe" : "";
        var options = new BuildPlayerOptions
        {
            scenes = scenes,
            locationPathName = $"{outputPath}/{match.arg}/Game{exe}",
            target = match.target,
            targetGroup = match.group,
            options = developmentBuild ? BuildOptions.Development : BuildOptions.None,
        };

        BuildReport report = BuildPipeline.BuildPlayer(options);
        var summary = report.summary;

        // A failed build is wrapped the same way a bad argument would be — the Pipeline
        // package doesn't care whether the exception came from your own guard clause or
        // from an Editor-native report object, as long as it's thrown before you return.
        if (summary.result != BuildResult.Succeeded)
            throw new Exception($"Build failed with {summary.totalErrors} error(s) — see the Editor log for details");

        var sizeMb = summary.totalSize / (1024f * 1024f);
        return $"Build succeeded: {match.arg} → '{options.locationPathName}' ({sizeMb:F1} MB, {summary.totalTime.TotalSeconds:F0}s, {summary.totalWarnings} warning(s))";
    }
}`;

const runSmokeTestSource = `// ---------------------------------------------------------------------------
// RunSmokeTestCommand.cs — custom command "Run-SmokeTest". A fast pre-flight
// check: loads every enabled scene in Build Settings and confirms each one
// runs a few frames without logging an error — the cheapest signal "is the
// build even startable" without paying for a full Build-Game run.
// ---------------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.Linq;
using Unity.Pipeline.Commands;
using UnityEditor;
using UnityEditor.SceneManagement;

public static class RunSmokeTestCommand
{
    [CliCommand("Run-SmokeTest", "Load every enabled scene and confirm it starts without errors",
                MainThreadRequired = true)]
    public static string RunSmokeTest(
        [CliArg("scenes",         "'all' (every enabled scene in Build Settings) or a single scene path")] string scenes = "all",
        [CliArg("framesPerScene", "How many frames to run before checking for errors")]                    int framesPerScene = 10,
        [CliArg("failFast",       "Stop at the first failing scene instead of checking them all")]         bool failFast = false)
    {
        if (framesPerScene < 1)
            throw new ArgumentException("framesPerScene must be at least 1");

        if (scenes != "all" && !System.IO.File.Exists(scenes))
            throw new ArgumentException($"Scene not found: '{scenes}'");

        var targets = scenes == "all"
            ? EditorBuildSettings.scenes.Where(s => s.enabled).Select(s => s.path).ToArray()
            : new[] { scenes };

        if (targets.Length == 0)
            throw new InvalidOperationException("No scenes to test — enable at least one scene in Build Settings");

        var failures = new List<string>();
        foreach (var path in targets)
        {
            EditorSceneManager.OpenScene(path, OpenSceneMode.Single);
            // Steps the Editor loop for framesPerScene frames, collecting any
            // Debug.LogError / exception raised in that window.
            var errors = SmokeTestRunner.PlayFrames(framesPerScene);

            if (errors.Count > 0)
            {
                failures.Add($"{path}: {errors.Count} error(s) — first: \\"{errors[0]}\\"");
                if (failFast) break;
            }
        }

        if (failures.Count > 0)
            throw new Exception($"Smoke test failed on {failures.Count}/{targets.Length} scene(s):\\n  " + string.Join("\\n  ", failures));

        return $"Smoke test passed: {targets.Length} scene(s) loaded and ran {framesPerScene} frames clean";
    }
}`;

const bakeNavMeshSource = `// ---------------------------------------------------------------------------
// BakeNavMeshCommand.cs — a custom command PAIR: "Bake-NavMesh" and its
// companion "Bake-NavMesh-Status". Demonstrates the async-job pattern used
// throughout the built-in commands (build, bake_*, package_add): the trigger
// command returns immediately, and a small static job-state holder is read
// back by a separate status command instead of blocking the caller.
// ---------------------------------------------------------------------------
using System;
using Unity.Pipeline.Commands;
using UnityEditor.AI;
using UnityEngine;

public static class BakeNavMeshCommand
{
    enum JobState { Idle, Baking, Completed, Failed }

    static JobState state = JobState.Idle;
    static string lastError = "";
    static AsyncOperation operation;

    [CliCommand("Bake-NavMesh", "Start an async NavMesh bake of the open scene(s) and return immediately",
                MainThreadRequired = true)]
    public static string BakeNavMesh()
    {
        if (state == JobState.Baking)
            throw new InvalidOperationException("A bake is already running — poll Bake-NavMesh-Status first");

        state = JobState.Baking;
        lastError = "";

        try
        {
            operation = NavMeshBuilder.BuildNavMeshAsync();
            operation.completed += _ => state = JobState.Completed;
        }
        catch (Exception ex)
        {
            state = JobState.Failed;
            lastError = ex.Message;
            throw;
        }

        return "Bake queued — poll Bake-NavMesh-Status for progress";
    }

    // A separate [CliCommand] on the same class — this is what makes it
    // pollable: it never triggers work itself, only reports the state the
    // trigger command above already put in motion.
    [CliCommand("Bake-NavMesh-Status", "Report the state of the last Bake-NavMesh call")]
    public static string BakeNavMeshStatus()
    {
        return state switch
        {
            JobState.Idle => "idle — no bake has been started",
            JobState.Baking => $"baking — {operation.progress:P0} complete",
            JobState.Completed => "completed",
            JobState.Failed => $"failed: {lastError}",
            _ => "unknown",
        };
    }
}`;

const selectGameObjectsSource = `// ---------------------------------------------------------------------------
// SelectGameObjectsCommand.cs — custom command "Select-GameObjects".
// [CliArg] has no array type, so a list of names travels as one
// comma-separated string and gets split in the method body — the same trick
// Set-BuildTarget uses for a fixed choice, just for an open-ended list.
// ---------------------------------------------------------------------------
using System;
using System.Linq;
using Unity.Pipeline.Commands;
using UnityEditor;
using UnityEngine;

public static class SelectGameObjectsCommand
{
    [CliCommand("Select-GameObjects", "Select every active GameObject whose name is in a comma-separated list")]
    public static string SelectGameObjects(
        [CliArg("names", "Comma-separated GameObject names, e.g. \\"Player,Enemy1,Enemy2\\"")] string names = "",
        [CliArg("includeInactive", "Also match inactive GameObjects")]                          bool includeInactive = false)
    {
        if (string.IsNullOrWhiteSpace(names))
            throw new ArgumentException("names must not be empty");

        var wanted = names.Split(',').Select(n => n.Trim()).Where(n => n.Length > 0).ToArray();

        var all = UnityEngine.Object.FindObjectsByType<Transform>(
            includeInactive ? FindObjectsInactive.Include : FindObjectsInactive.Exclude,
            FindObjectsSortMode.None);

        var matches = all.Where(t => wanted.Contains(t.name))
                          .Select(t => (UnityEngine.Object)t.gameObject)
                          .ToArray();

        if (matches.Length == 0)
            throw new ArgumentException($"None of the requested names matched a GameObject in the active scene: {names}");

        Selection.objects = matches;
        return $"Selected {matches.Length}/{wanted.Length} requested object(s): {string.Join(", ", matches.Select(m => m.name))}";
    }
}`;

const frameObjectSource = `// ---------------------------------------------------------------------------
// FrameObjectCommand.cs — custom command "Frame-Object".
// Manipulates the Editor's own UI (the Scene View camera) rather than scene
// data — a different flavor of "safe mutation" than SpawnCube's Undo/dirty
// ceremony: there's nothing here for Ctrl+Z to undo, because nothing about
// the scene itself changed.
// ---------------------------------------------------------------------------
using System;
using Unity.Pipeline.Commands;
using UnityEditor;
using UnityEngine;

public static class FrameObjectCommand
{
    [CliCommand("Frame-Object", "Move the Scene View camera to frame a GameObject by name",
                MainThreadRequired = true)]
    public static string FrameObject(
        [CliArg("target",  "Name of the GameObject to frame")]                        string target = "",
        [CliArg("instant", "Snap immediately instead of animating the transition")]    bool instant = false)
    {
        if (string.IsNullOrWhiteSpace(target))
            throw new ArgumentException("target must not be empty");

        var go = GameObject.Find(target);
        if (go == null)
            throw new ArgumentException($"No active GameObject named '{target}' was found in the scene");

        var sceneView = SceneView.lastActiveSceneView;
        if (sceneView == null)
            throw new InvalidOperationException("No Scene View is open — open one before calling Frame-Object");

        Selection.activeGameObject = go;
        sceneView.Frame(new Bounds(go.transform.position, Vector3.one * 2f), instant);

        return $"Framed '{go.name}' at {go.transform.position} in the Scene View";
    }
}`;

export const examples: CliExample[] = [
  {
    slug: "spawn-cube",
    commandName: "Spawn-Cube",
    title: "Spawn-Cube",
    tagline: "Create one or more cubes in the active scene — the flagship walkthrough example.",
    category: "mutating",
    mainThreadRequired: true,
    flagship: true,
    args: [
      { name: "name", description: "Name of the cube (numbered when count > 1)", type: "string", default: "Cube" },
      { name: "x", description: "X position of the first cube", type: "number", default: 0 },
      { name: "y", description: "Y position of the first cube", type: "number", default: 0 },
      { name: "z", description: "Z position of the first cube", type: "number", default: 0 },
      { name: "size", description: "Uniform scale of each cube", type: "number", default: 1, min: 0.01 },
      { name: "color", description: "Hex color, e.g. #FF8800 (empty = default material)", type: "string", default: "" },
      { name: "count", description: "How many cubes to create in a row along X (1–100)", type: "number", default: 1, min: 1, max: 100 },
      { name: "spacing", description: "Distance between cubes along X", type: "number", default: 1.5 },
    ],
    source: spawnCubeSource,
    usageLines: [
      "unity command Spawn-Cube",
      "unity command Spawn-Cube --name Crate --x 0 --y 1 --z 0",
      'unity command Spawn-Cube --name Wall --count 5 --spacing 1.1 --size 1 --color "#F2B705"',
      "unity run ./MyGame --command Spawn-Cube -- --name Crate",
    ],
    successTemplate: (a) => {
      const name = String(a.name || "Cube");
      const count = Number(a.count ?? 1);
      const x = Number(a.x ?? 0);
      const y = Number(a.y ?? 0);
      const z = Number(a.z ?? 0);
      const pos = `(${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)})`;
      return count === 1
        ? `Spawned '${name}' at ${pos} in scene 'SampleScene'`
        : `Spawned ${count} cubes '${name}_1'…'${name}_${count}' starting at ${pos} in scene 'SampleScene'`;
    },
    errorCases: [
      { label: "Empty name", args: { name: "" }, error: "ArgumentException: name must not be empty" },
      { label: "Zero size", args: { size: 0 }, error: "ArgumentException: size must be greater than 0" },
      { label: "Count out of range", args: { count: 250 }, error: "ArgumentException: count must be between 1 and 100" },
      { label: "Bad color", args: { color: "not-a-color" }, error: "ArgumentException: 'not-a-color' is not a valid color. Use a hex value like #FF8800." },
    ],
  },
  {
    slug: "query-scene-stats",
    commandName: "Query-SceneStats",
    title: "Query-SceneStats",
    tagline: "A read-only query command — reports scene counts without touching anything.",
    category: "read-only",
    mainThreadRequired: false,
    args: [
      { name: "includeInactive", description: "Count inactive GameObjects too", type: "boolean", default: false },
      { name: "format", description: "Output format", type: "choice", default: "text", choices: ["text", "json"] },
    ],
    source: querySceneStatsSource,
    usageLines: [
      "unity command Query-SceneStats",
      "unity command Query-SceneStats --includeInactive true",
      "unity command Query-SceneStats --format json",
    ],
    successTemplate: (a) =>
      a.format === "json"
        ? `{"scene":"SampleScene","gameObjects":128,"renderers":54,"lights":3,"triangles":48210}`
        : `Scene: SampleScene\n  GameObjects : 128${a.includeInactive ? "" : " (active only)"}\n  Renderers   : 54\n  Lights      : 3\n  Triangles   : 48,210`,
    errorCases: [],
    keyDifferences: [
      "No Undo group, no MarkSceneDirty, no Selection — nothing in the scene changes.",
      "MainThreadRequired is omitted; a pure read like this can safely run off the main thread.",
      "Returns a multi-line report string instead of a single confirmation line.",
    ],
  },
  {
    slug: "set-build-target",
    commandName: "Set-BuildTarget",
    title: "Set-BuildTarget",
    tagline: "A choice/enum-style argument, validated against an allow-list.",
    category: "settings",
    mainThreadRequired: false,
    args: [
      {
        name: "platform",
        description: "One of: Windows, macOS, Linux, iOS, Android, WebGL",
        type: "choice",
        default: "Windows",
        choices: ["Windows", "macOS", "Linux", "iOS", "Android", "WebGL"],
      },
    ],
    source: setBuildTargetSource,
    usageLines: [
      "unity command Set-BuildTarget --platform Android",
      "unity command Set-BuildTarget --platform WebGL",
    ],
    successTemplate: (a) => `Active build target set to '${a.platform}' (${a.platform === "Windows" ? "StandaloneWindows64" : a.platform})`,
    errorCases: [
      {
        label: "Unknown platform",
        args: { platform: "PlayStation" },
        error: "ArgumentException: 'PlayStation' is not a valid platform. Choose one of: Windows, macOS, Linux, iOS, Android, WebGL",
      },
    ],
    keyDifferences: [
      "[CliArg] has no dedicated enum type, so the choice is a string checked against an explicit allow-list.",
      "The error message lists every valid choice — mirror this pattern any time you hand-roll a choice argument.",
      "A commented-out alternative in the source shows the same command written against a real C# enum instead.",
    ],
  },
  {
    slug: "batch-optimize-textures",
    commandName: "Batch-OptimizeTextures",
    title: "Batch-OptimizeTextures",
    tagline: "A longer-running batch command that aggregates per-file results into one summary.",
    category: "batch",
    mainThreadRequired: true,
    args: [
      { name: "folder", description: "Project-relative folder to scan", type: "string", default: "Assets/Textures" },
      { name: "maxSize", description: "Max texture dimension in pixels", type: "number", default: 2048 },
      { name: "dryRun", description: "Report what would change without writing anything", type: "boolean", default: false },
    ],
    source: batchOptimizeTexturesSource,
    usageLines: [
      "unity command Batch-OptimizeTextures",
      "unity command Batch-OptimizeTextures --folder Assets/UI --maxSize 1024",
      "unity command Batch-OptimizeTextures --dryRun true",
    ],
    successTemplate: (a) => {
      const verb = a.dryRun ? "Would process" : "Processed";
      return `${verb} 42 textures (3 skipped, 1 failed) under '${a.folder || "Assets/Textures"}'`;
    },
    errorCases: [
      { label: "Invalid folder", args: { folder: "Assets/DoesNotExist" }, error: "ArgumentException: 'Assets/DoesNotExist' is not a valid project folder" },
    ],
    keyDifferences: [
      "Loops over an AssetDatabase.FindAssets() query instead of creating new objects.",
      "Aggregates processed/skipped/failed counts into a single return line rather than logging per file.",
      "A dryRun flag lets the CLI caller preview the effect before committing to it.",
    ],
  },
  {
    slug: "toggle-debug-overlay",
    commandName: "Toggle-DebugOverlay",
    title: "Toggle-DebugOverlay",
    tagline: "The simplest category: a settings toggle with no scene-mutation ceremony at all.",
    category: "settings",
    mainThreadRequired: false,
    args: [{ name: "enabled", description: "true to show the overlay, false to hide it", type: "boolean", default: true }],
    source: toggleDebugOverlaySource,
    usageLines: ["unity command Toggle-DebugOverlay", "unity command Toggle-DebugOverlay --enabled false"],
    successTemplate: (a) => `Debug overlay ${a.enabled === false || a.enabled === "false" ? "disabled" : "enabled"}`,
    errorCases: [],
    keyDifferences: [
      "Writes an EditorPrefs flag, not the scene graph — so no Undo group, no MarkSceneDirty, no Selection.",
      "Good template for any command that flips a project or editor setting rather than creating objects.",
    ],
  },
  {
    slug: "get-missing-references",
    commandName: "Get-MissingReferences",
    title: "Get-MissingReferences",
    tagline: "A read-only scan whose error path depends on project state, not on arguments.",
    category: "read-only",
    mainThreadRequired: false,
    args: [],
    source: getMissingReferencesSource,
    usageLines: ["unity command Get-MissingReferences"],
    successTemplate: () => `No missing script references found in 'SampleScene'`,
    errorCases: [
      {
        label: "Unsaved scene",
        args: {},
        error: "InvalidOperationException: Active scene has no path — save it first",
      },
    ],
    keyDifferences: [
      "Throws InvalidOperationException based on environment state (an unsaved scene), not on a bad argument.",
      "Complements SpawnCube's ArgumentException style and Set-BuildTarget's choice-list error with a third error flavor.",
      "Takes no arguments at all — a valid, minimal shape for a [CliCommand].",
    ],
  },
  {
    slug: "build-game",
    commandName: "Build-Game",
    title: "Build-Game",
    tagline: "The longest-running example — a real player build, reduced to one summary line.",
    category: "build",
    mainThreadRequired: true,
    args: [
      {
        name: "platform",
        description: "One of: Windows, macOS, Linux, WebGL",
        type: "choice",
        default: "Windows",
        choices: ["Windows", "macOS", "Linux", "WebGL"],
      },
      { name: "outputPath", description: "Folder the build is written to", type: "string", default: "Builds" },
      { name: "developmentBuild", description: "Include debug symbols and the profiler", type: "boolean", default: false },
    ],
    source: buildGameSource,
    usageLines: [
      "unity command Build-Game",
      "unity command Build-Game --platform WebGL --outputPath Builds/Web",
      "unity command Build-Game --platform Linux --developmentBuild true",
      "unity run ./MyGame --command Build-Game -- --platform Windows",
    ],
    successTemplate: (a) => {
      const platform = String(a.platform || "Windows");
      const outputPath = String(a.outputPath || "Builds");
      const exe = platform === "Windows" ? ".exe" : "";
      return `Build succeeded: ${platform} → '${outputPath}/${platform}/Game${exe}' (184.3 MB, 47s, 0 warning(s))`;
    },
    errorCases: [
      {
        label: "Unknown platform",
        args: { platform: "PlayStation5" },
        error: "ArgumentException: 'PlayStation5' is not a valid platform. Choose one of: Windows, macOS, Linux, WebGL",
      },
      { label: "Empty output path", args: { outputPath: "" }, error: "ArgumentException: outputPath must not be empty" },
      {
        label: "No scenes enabled",
        args: {},
        error: "InvalidOperationException: No scenes are enabled in Build Settings — nothing to build",
      },
    ],
    keyDifferences: [
      "By far the longest-running command in this gallery — a real BuildPipeline.BuildPlayer call, not a scene edit. Treat multi-minute commands the same way: one summary line at the end, not per-asset logging.",
      "Reads its scene list from Build Settings rather than an argument — build inputs often come from project configuration, not CLI flags.",
      "Wraps a failed BuildReport in a thrown exception the same way a bad argument would be — the Pipeline package doesn't distinguish where the exception came from.",
    ],
  },
  {
    slug: "run-smoke-test",
    commandName: "Run-SmokeTest",
    title: "Run-SmokeTest",
    tagline: "Loads every enabled scene and confirms it starts clean — a fast pre-flight before a full build.",
    category: "testing",
    mainThreadRequired: true,
    args: [
      { name: "scenes", description: "'all' (every enabled scene in Build Settings) or a single scene path", type: "string", default: "all" },
      { name: "framesPerScene", description: "How many frames to run before checking for errors", type: "number", default: 10, min: 1 },
      { name: "failFast", description: "Stop at the first failing scene instead of checking them all", type: "boolean", default: false },
    ],
    source: runSmokeTestSource,
    usageLines: [
      "unity command Run-SmokeTest",
      "unity command Run-SmokeTest --scenes Assets/Scenes/Main.unity",
      "unity command Run-SmokeTest --failFast true",
      "unity run ./MyGame --command Run-SmokeTest -- --framesPerScene 30",
    ],
    successTemplate: (a) => {
      const count = a.scenes === "all" || !a.scenes ? 4 : 1;
      const frames = a.framesPerScene ?? 10;
      return `Smoke test passed: ${count} scene(s) loaded and ran ${frames} frames clean`;
    },
    errorCases: [
      { label: "Zero frames", args: { framesPerScene: 0 }, error: "ArgumentException: framesPerScene must be at least 1" },
      {
        label: "Scene not found",
        args: { scenes: "Assets/Scenes/Nope.unity" },
        error: "ArgumentException: Scene not found: 'Assets/Scenes/Nope.unity'",
      },
      {
        label: "No scenes enabled",
        args: {},
        error: "InvalidOperationException: No scenes to test — enable at least one scene in Build Settings",
      },
    ],
    keyDifferences: [
      "Pairs naturally with Build-Game: run this first in CI as a cheap pre-flight, then only pay for a full build once it passes.",
      "Aggregates failures across every scene into one exception instead of stopping at the first — pass failFast for fail-on-first CI behavior instead.",
      "Combines all three error-path flavors from this gallery in one command: a bad argument (framesPerScene), an invalid reference (scene path), and environment state (no scenes enabled).",
    ],
  },
  {
    slug: "bake-navmesh",
    commandName: "Bake-NavMesh",
    title: "Bake-NavMesh",
    tagline: "A trigger + status command pair — build your own version of the async job pattern the built-ins use.",
    category: "async",
    mainThreadRequired: true,
    args: [],
    source: bakeNavMeshSource,
    usageLines: ["unity command Bake-NavMesh", "unity command Bake-NavMesh-Status"],
    successTemplate: () => "Bake queued — poll Bake-NavMesh-Status for progress",
    errorCases: [
      {
        label: "Already baking",
        args: {},
        error: "InvalidOperationException: A bake is already running — poll Bake-NavMesh-Status first",
      },
    ],
    keyDifferences: [
      "Two [CliCommand] methods on one class: the trigger never blocks, and a separate status command reports progress from a small static job-state holder — the same shape as the built-in build/bake_*/package_add commands documented on the Built-in Commands page.",
      "Nothing here is Undo-tracked or scene-mutating in the SpawnCube sense — the 'state' being managed is the job itself, not scene data.",
      "Guards against a second bake starting while one is already running, an error case an argument-only command can't express because it takes no arguments at all.",
    ],
  },
  {
    slug: "select-gameobjects",
    commandName: "Select-GameObjects",
    title: "Select-GameObjects",
    tagline: "An open-ended list of names, passed as one comma-separated string and split in C#.",
    category: "settings",
    mainThreadRequired: false,
    args: [
      { name: "names", description: 'Comma-separated GameObject names, e.g. "Player,Enemy1,Enemy2"', type: "string", default: "Player,Enemy1,Enemy2" },
      { name: "includeInactive", description: "Also match inactive GameObjects", type: "boolean", default: false },
    ],
    source: selectGameObjectsSource,
    usageLines: [
      "unity command Select-GameObjects --names Player",
      'unity command Select-GameObjects --names "Player,Enemy1,Enemy2"',
      "unity command Select-GameObjects --names Boss --includeInactive true",
    ],
    successTemplate: (a) => {
      const names = String(a.names || "")
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);
      return `Selected ${names.length}/${names.length} requested object(s): ${names.join(", ")}`;
    },
    errorCases: [
      { label: "Empty names", args: { names: "" }, error: "ArgumentException: names must not be empty" },
      {
        label: "No matches",
        args: { names: "DoesNotExist" },
        error: "ArgumentException: None of the requested names matched a GameObject in the active scene: DoesNotExist",
      },
    ],
    keyDifferences: [
      "[CliArg] has no array type — an open-ended list travels as one comma-separated string, split with string.Split in the method body, the same escape hatch every CLI eventually reaches for.",
      "Reports a partial-match count (matched/requested) instead of failing on the first name that doesn't resolve, so one typo in a long list doesn't block the rest.",
      "Only errors when zero names match at all — see the source for how to tighten that to an all-or-nothing check if your use case needs it.",
    ],
  },
  {
    slug: "frame-object",
    commandName: "Frame-Object",
    title: "Frame-Object",
    tagline: "Moves the Scene View camera, not the scene — a mutation with nothing for Ctrl+Z to undo.",
    category: "settings",
    mainThreadRequired: true,
    args: [
      { name: "target", description: "Name of the GameObject to frame", type: "string", default: "Player" },
      { name: "instant", description: "Snap immediately instead of animating the transition", type: "boolean", default: false },
    ],
    source: frameObjectSource,
    usageLines: ["unity command Frame-Object --target Player", "unity command Frame-Object --target Boss --instant true"],
    successTemplate: (a) => `Framed '${a.target || "Player"}' at (12.0, 0.0, 4.0) in the Scene View`,
    errorCases: [
      { label: "Empty target", args: { target: "" }, error: "ArgumentException: target must not be empty" },
      {
        label: "Object not found",
        args: { target: "Nonexistent" },
        error: "ArgumentException: No active GameObject named 'Nonexistent' was found in the scene",
      },
      {
        label: "No Scene View open",
        args: {},
        error: "InvalidOperationException: No Scene View is open — open one before calling Frame-Object",
      },
    ],
    keyDifferences: [
      "Touches the Editor's own UI (the Scene View camera) instead of scene data — there's nothing for Undo to track, because nothing about the scene itself changed.",
      "GameObject.Find is a simple name lookup; for anything beyond a quick command it's worth comparing against find_gameobjects on the Built-in Commands page, which filters by tag, component type and hierarchy path too.",
      "A third error flavor for the same command: bad argument (empty target), invalid reference (unknown name), and environment state (no Scene View open) all in one place.",
    ],
  },
];

export const flagshipExample = examples[0];
export const galleryExamples = examples.slice(1);

export function getExampleBySlug(slug: string): CliExample | undefined {
  return examples.find((e) => e.slug === slug);
}
