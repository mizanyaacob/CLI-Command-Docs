import type { CodeHotspot } from "../types/cli";

export const spawnCubeHotspots: CodeHotspot[] = [
  {
    id: "registration",
    label: "Registering the command",
    lineStart: 20,
    lineEnd: 22,
    cliMapping: "unity command Spawn-Cube",
    explanation:
      "[CliCommand] turns this static method into a CLI command named \"Spawn-Cube\". The second argument is the one-line help text shown by --help. MainThreadRequired = true tells the Pipeline package to marshal the call onto Unity's main thread first, because this method is about to touch the scene — Editor APIs like GameObject.CreatePrimitive are not thread-safe.",
  },
  {
    id: "args",
    label: "Declaring arguments",
    lineStart: 23,
    lineEnd: 30,
    cliMapping: "--name, --x, --y, --z, --size, --color, --count, --spacing",
    explanation:
      "Each [CliArg] becomes one optional CLI flag. The C# parameter's default value (\"Cube\", 0f, 1, ...) is exactly the value used when the flag is omitted — there's no separate 'default' to configure. The parameter type (string/float/int) determines how the CLI parses the raw text the user typed.",
  },
  {
    id: "validation",
    label: "Validating input",
    lineStart: 32,
    lineEnd: 35,
    cliMapping: "non-zero exit + ArgumentException message on stderr",
    explanation:
      "Plain guard clauses. Throwing ArgumentException here is the whole error-handling story — the Pipeline package catches it, reports the message back to the CLI caller, and exits non-zero. There's no special CLI-specific exception type to learn.",
  },
  {
    id: "color-parsing",
    label: "Parsing the color",
    lineStart: 37,
    lineEnd: 43,
    cliMapping: "--color \"#F2B705\"",
    explanation:
      "An optional string arg (empty by default) is parsed only when supplied. ColorUtility.TryParseHtmlString does the real validation; a bad hex value is turned into the same kind of ArgumentException as the guard clauses above, so callers see one consistent error style regardless of which check failed.",
  },
  {
    id: "undo-start",
    label: "Starting an Undo group",
    lineStart: 45,
    lineEnd: 47,
    explanation:
      "Undo.IncrementCurrentGroup() opens a new Undo group before any object is created. Everything registered until CollapseUndoOperations (further down) is later merged into that one group, so a single Ctrl+Z removes the whole batch instead of one cube at a time.",
  },
  {
    id: "loop-create",
    label: "Creating the cubes",
    lineStart: 49,
    lineEnd: 55,
    cliMapping: "--count 5 --spacing 1.1",
    explanation:
      "The actual mutation: one primitive per iteration, positioned along X using --spacing, named with a numeric suffix once count > 1. This is the only part of the method that depends on the count/spacing/name/position args together.",
  },
  {
    id: "tint-material",
    label: "Applying the tint",
    lineStart: 57,
    lineEnd: 64,
    cliMapping: "--color \"#F2B705\"",
    explanation:
      "A fresh Material is cloned per cube rather than editing cube.sharedMaterial directly — the shared default material is used by every primitive in the project, so mutating it in place would recolor unrelated objects too.",
  },
  {
    id: "undo-register",
    label: "Registering for Undo",
    lineStart: 66,
    lineEnd: 67,
    explanation:
      "Each created GameObject is registered individually with Undo.RegisterCreatedObjectUndo — this is what actually makes each cube undoable; the group opened earlier just decides how many of these get merged into one Ctrl+Z step.",
  },
  {
    id: "wrap-up",
    label: "Wrapping up: collapse, dirty, select",
    lineStart: 70,
    lineEnd: 72,
    explanation:
      "Three small but easy-to-forget calls: CollapseUndoOperations closes the group opened above; MarkSceneDirty tells Unity the scene has unsaved changes (otherwise Ctrl+S/Save would silently no-op); Selection.objects highlights the new cubes in the Hierarchy, exactly as if you'd created them by hand.",
  },
  {
    id: "return",
    label: "Returning a result",
    lineStart: 74,
    lineEnd: 77,
    cliMapping: "printed as the command's result in your terminal",
    explanation:
      "The returned string is what the CLI prints back to you as the command's result — useful for scripting (pipe it, grep it, log it in CI) as well as for a human glancing at what just happened.",
  },
];
