import type { BuiltinCategory } from "../types/builtin";

export const builtinCategories: BuiltinCategory[] = [
  // ---------------------------------------------------------------------
  {
    id: "gameobjects",
    title: "GameObjects & Selection",
    intro:
      "The bread-and-butter commands for building a scene by hand: create, delete, rename, reparent, and reposition GameObjects, and read or set what's selected in the Hierarchy. Every one of these is a normal, undoable Editor edit — Ctrl+Z works exactly as if you'd done it with the mouse.",
    commands: [
      {
        name: "create_gameobject",
        summary: "Create an empty GameObject or a built-in primitive (cube/sphere/capsule/cylinder/plane/quad) in the active scene.",
        args: [
          { name: "name", type: "string", description: "Name for the new GameObject. Defaults to 'GameObject' (or the primitive name)." },
          { name: "primitive", type: "string", description: "Optional: cube, sphere, capsule, cylinder, plane, quad. Omit for an empty GameObject." },
          { name: "parent", type: "objectref", description: "Optional parent handle. The new object becomes a child of it." },
        ],
      },
      {
        name: "create_gameobjects",
        summary: "Batch-create N empty GameObjects or primitives in one call, with optional per-object positions/rotations/scales.",
        args: [
          { name: "name", type: "string", description: "Base name. With count>1 and no explicit names, objects are suffixed Name1..NameN." },
          { name: "primitive", type: "string", description: "Optional primitive type: cube, sphere, capsule, cylinder, plane, quad." },
          { name: "parent", type: "objectref", description: "Optional parent handle. Every created object becomes a child of it." },
          { name: "count", type: "int", defaultValue: "1", description: "How many GameObjects to create." },
          { name: "positions", type: "single[][]", description: "Local positions, one [x,y,z] per object. Length must equal count when supplied." },
          { name: "rotations", type: "single[][]", description: "Local Euler rotations (degrees), one [x,y,z] per object." },
          { name: "scales", type: "single[][]", description: "Local scales, one [x,y,z] per object." },
        ],
      },
      {
        name: "spawn_test_cube",
        summary: "Create a primitive Cube GameObject at a given position — a quick smoke-test helper.",
        args: [
          { name: "name", type: "string", defaultValue: "TestCube", description: "GameObject name." },
          { name: "x", type: "float", defaultValue: "0", description: "Position X." },
          { name: "y", type: "float", defaultValue: "0", description: "Position Y." },
          { name: "z", type: "float", defaultValue: "0", description: "Position Z." },
        ],
      },
      {
        name: "delete_gameobject",
        summary: "Delete a GameObject from the scene (reversible via Undo).",
        args: [{ name: "target", type: "objectref", required: true, description: "Handle of the GameObject to delete." }],
      },
      {
        name: "delete_test_objects",
        summary: "Destroy every root GameObject named 'TestCube*' — the cleanup half of spawn_test_cube.",
        args: [],
      },
      {
        name: "rename_gameobject",
        summary: "Rename a GameObject.",
        args: [
          { name: "target", type: "objectref", required: true, description: "Handle of the GameObject." },
          { name: "name", type: "string", required: true, description: "New name." },
        ],
      },
      {
        name: "set_parent",
        summary: "Reparent a GameObject under a new parent, or detach it to scene root when no parent is given.",
        args: [
          { name: "target", type: "objectref", required: true, description: "Handle of the GameObject to reparent." },
          { name: "parent", type: "objectref", description: "Handle of the new parent. Omit to move the object to the scene root." },
          { name: "world_position_stays", type: "bool", defaultValue: "true", description: "Keep the object's world position when reparenting." },
        ],
      },
      {
        name: "set_active",
        summary: "Set a GameObject's active self-state (activeSelf).",
        args: [
          { name: "target", type: "objectref", required: true, description: "Handle of the GameObject." },
          { name: "active", type: "bool", required: true, description: "Desired active state." },
        ],
      },
      {
        name: "set_transform",
        summary: "Set a GameObject's local position/rotation(euler)/scale. Omitted channels are left unchanged.",
        args: [
          { name: "target", type: "objectref", required: true, description: "Handle of the GameObject to modify." },
          { name: "position", type: "single[]", description: "Local position as [x,y,z]." },
          { name: "rotation", type: "single[]", description: "Local rotation as Euler angles [x,y,z] in degrees." },
          { name: "scale", type: "single[]", description: "Local scale as [x,y,z]." },
        ],
      },
      {
        name: "set_tag",
        summary: "Set a GameObject's tag (the tag must already exist in the project — see set_tags_layers).",
        args: [
          { name: "target", type: "objectref", required: true, description: "Handle of the GameObject." },
          { name: "tag", type: "string", required: true, description: "Tag to assign (must exist in the Tag Manager)." },
        ],
      },
      {
        name: "set_layer",
        summary: "Set a GameObject's layer by name or numeric index (0-31).",
        args: [
          { name: "target", type: "objectref", required: true, description: "Handle of the GameObject." },
          { name: "layer", type: "string", required: true, description: "Layer name (e.g. 'UI') or numeric index 0-31." },
        ],
      },
      {
        name: "find_gameobjects",
        summary: "Find GameObjects in loaded scenes by name, tag, component type, and/or hierarchy path (filters combine).",
        args: [
          { name: "name", type: "string", description: "Exact name to match." },
          { name: "tag", type: "string", description: "Tag to match (e.g. 'Player')." },
          { name: "type", type: "string", description: "Component type name to match (e.g. 'Rigidbody', 'UnityEngine.Camera')." },
          { name: "hierarchy_path", type: "string", description: "Exact hierarchy path to match (e.g. '/Root/Child')." },
          { name: "include_inactive", type: "bool", defaultValue: "true", description: "Include inactive GameObjects." },
        ],
      },
      { name: "list_scene_objects", summary: "List names of root GameObjects in the active scene.", args: [] },
      { name: "count_scene_objects", summary: "Count root GameObjects in the active scene.", args: [] },
      { name: "get_selection", summary: "Read the current Editor selection as structured object identities.", args: [] },
      {
        name: "set_selection",
        summary: "Set the Editor selection to the given assets/scene objects.",
        args: [
          { name: "instance_ids", type: "objectid[]", description: "Scene/loaded object instance IDs to select." },
          { name: "paths", type: "string[]", description: "Asset paths to select (e.g. Assets/Foo.prefab)." },
        ],
      },
    ],
    example: {
      title: "Build a small test rig",
      narrative:
        "A common onboarding task: spawn a row of platforms, tag one as the goal, and select everything you just made so it's easy to see in the Hierarchy.",
      steps: [
        { command: 'unity command create_gameobjects --name Platform --primitive cube --count 5 --positions "[[0,0,0],[2,0,0],[4,0,0],[6,0,0],[8,0,0]]"', note: "five cubes in a row, named Platform1..Platform5" },
        { command: "unity command set_tag --target Platform5 --tag Goal", note: "mark the last one as the goal" },
        { command: 'unity command find_gameobjects --name Platform1', note: "confirm it exists before wiring up gameplay" },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "scenes",
    title: "Scenes & Build List",
    intro:
      "Open, create, save, and inspect scenes, and manage which scenes ship in a build. Reach for these before any GameObject command — most of them need a loaded scene to act on.",
    commands: [
      {
        name: "create_scene",
        summary: "Create a new scene and save it to the given path under the authoring root.",
        args: [
          { name: "path", type: "string", required: true, description: "Scene path relative to the authoring root; Assets/ prefix and .unity optional." },
          { name: "additive", type: "bool", defaultValue: "false", description: "Open the new scene additively alongside currently open scenes instead of replacing them." },
          { name: "template", type: "string", defaultValue: "empty", description: "'empty' for a blank scene, or 'default' to seed a Main Camera + Directional Light." },
        ],
      },
      {
        name: "open_scene",
        summary: "Open an existing scene from the given path.",
        args: [
          { name: "path", type: "string", required: true, description: "Scene path relative to the authoring root; Assets/ prefix and .unity extension optional." },
          { name: "additive", type: "bool", defaultValue: "false", description: "Open additively alongside currently open scenes instead of replacing them." },
        ],
      },
      { name: "save_scene", summary: "Save an open scene. Saves the active scene when no path is given.", args: [{ name: "path", type: "string", description: "Path of the open scene to save. Omit to save the active scene." }] },
      { name: "save_all", summary: "Save all open scenes that have unsaved changes.", args: [] },
      {
        name: "set_active_scene",
        summary: "Set which open scene is the active scene (new objects are created in the active scene).",
        args: [{ name: "path", type: "string", required: true, description: "Path of an already-open scene to make active." }],
      },
      { name: "list_open_scenes", summary: "List all currently open scenes with their load/active/dirty state.", args: [] },
      {
        name: "get_scene_hierarchy",
        summary: "Return the GameObject tree of an open scene (or the active scene), each node carrying an instanceId + hierarchyPath.",
        args: [{ name: "path", type: "string", description: "Path of the open scene to snapshot. Omit for the active scene." }],
      },
      {
        name: "add_scene_to_build",
        summary: "Add a scene to the Build Settings scene list (idempotent). Optionally enable it.",
        args: [
          { name: "path", type: "string", required: true, description: "Scene path to add." },
          { name: "enabled", type: "bool", defaultValue: "true", description: "Whether the scene is enabled in the build list." },
        ],
      },
      {
        name: "remove_scene_from_build",
        summary: "Remove a scene from the Build Settings scene list (idempotent).",
        args: [{ name: "path", type: "string", required: true, description: "Scene path to remove." }],
      },
    ],
    example: {
      title: "Stand up a new level and wire it into the build",
      narrative: "Creating a fresh scene, seeding it with the standard 3D template objects, then registering it so a Build-Game command actually includes it.",
      steps: [
        { command: "unity command create_scene --path Scenes/Level2 --template default", note: "camera + directional light already in place" },
        { command: "unity command save_scene --path Scenes/Level2" },
        { command: "unity command add_scene_to_build --path Scenes/Level2 --enabled true" },
        { command: "unity command list_open_scenes", note: "sanity-check before handing off to a build" },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "components",
    title: "Components & Serialized Fields",
    intro:
      "Once a GameObject exists, this is how you attach behavior to it and read or write the values the Inspector would normally show you — down to individual array elements.",
    commands: [
      {
        name: "add_component",
        summary: "Add a component (by type name) to a GameObject.",
        args: [
          { name: "target", type: "objectref", required: true, description: "Handle of the GameObject." },
          { name: "type", type: "string", required: true, description: "Component type name (e.g. 'Rigidbody' or 'UnityEngine.Camera')." },
        ],
      },
      {
        name: "attach_script",
        summary:
          "Add a MonoBehaviour to a GameObject by its compiled type name OR its script asset path — exactly one of the two. If the type isn't compiled yet, recompile → poll recompile_status → retry.",
        args: [
          { name: "target", type: "objectref", required: true, description: "GameObject to add the component to." },
          { name: "type", type: "string", description: "Component type name, e.g. PlayerController. Must already be compiled. Mutually exclusive with 'script'." },
          { name: "script", type: "string", description: "Script asset path, e.g. 'Assets/Pool/Scripts/CueShooter.cs'. Mutually exclusive with 'type'." },
        ],
      },
      {
        name: "remove_component",
        summary: "Remove a component from a GameObject. Provide a component handle, or a GameObject handle plus a type name.",
        args: [
          { name: "target", type: "objectref", required: true, description: "Handle of the component, OR of the GameObject when 'type' is given." },
          { name: "type", type: "string", description: "Component type name to remove (omit when 'target' already points at a component)." },
        ],
      },
      {
        name: "get_component_properties",
        summary: "Get a component's serialized properties as a JSON map. Address by handle, or by GameObject handle + type.",
        args: [
          { name: "target", type: "objectref", required: true, description: "Handle of the component, OR of the GameObject when 'type' is given." },
          { name: "type", type: "string", description: "Component type name on the target GameObject (omit when 'target' is a component handle)." },
        ],
      },
      {
        name: "set_component_properties",
        summary: "Set serialized properties on a component in one Undo step. Vectors/colors are arrays; object refs are handle objects.",
        args: [
          { name: "target", type: "objectref", required: true, description: "Handle of the component, OR of the GameObject when 'type' is given." },
          { name: "properties", type: "jobject", required: true, description: "Map of serialized property name to value." },
          { name: "type", type: "string", description: "Component type name (omit when 'target' is a component handle)." },
        ],
      },
      {
        name: "get_serialized_fields",
        summary:
          "Read serialized fields of a component/asset: name, type, value per top-level field. Pass 'field' for one path, or format='value' for a token-efficient scalar read.",
        args: [
          { name: "target", type: "objectref", required: true, description: "Component or asset to read." },
          { name: "field", type: "string", description: "Optional single SerializedProperty path (e.g. 'speed' or 'items.Array.data[0]')." },
          { name: "component", type: "string", description: "Component type name — use when 'target' is a GameObject." },
          { name: "format", type: "string", description: "Omit for a full descriptor per field, or 'value' for just the value(s)." },
        ],
      },
      {
        name: "set_serialized_field",
        summary:
          "Set a serialized field on a component/asset. Supports primitives, enums, Vector/Color/Rect/Bounds, object references, and array elements via 'name.Array.data[i]'.",
        args: [
          { name: "target", type: "objectref", required: true, description: "Component or asset to modify." },
          { name: "field", type: "string", required: true, description: "SerializedProperty path, e.g. 'speed', 'waypoints.Array.data[0]'." },
          { name: "value", type: "jtoken", required: true, description: "JSON value to assign. Object refs use an ObjectRef object; enums use the value name." },
          { name: "component", type: "string", description: "Component type name — use when 'target' is a GameObject." },
        ],
      },
    ],
    example: {
      title: "Attach and configure gameplay behavior",
      narrative: "The pattern you'll use constantly: write a script, wait for it to compile, attach it, then tune its fields without opening the Inspector.",
      steps: [
        { command: "unity command create_script --name PlayerController --base_class MonoBehaviour" },
        { command: "unity command recompile", note: "or just wait — attach_script tells you to do this if needed" },
        { command: "unity command recompile_status", note: "poll until 'completed'" },
        { command: "unity command attach_script --target Player --type PlayerController" },
        { command: 'unity command set_serialized_field --target Player --component PlayerController --field speed --value 6.5' },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "assets",
    title: "Assets & Project Files",
    intro:
      "Everything that lives under Assets/ but isn't a scene: creating, moving, importing, and inspecting assets, plus reading/writing plain text files. Most of these are scoped to an \"authoring root\" — a folder boundary you can narrow with set_authoring_root so an agent can't wander outside a project's designated work area.",
    commands: [
      {
        name: "get_authoring_root",
        summary: "Get the base folder (under Assets/) that bare authoring paths resolve against.",
        args: [],
      },
      {
        name: "set_authoring_root",
        summary: "Set the authoring root that bare paths resolve against and are confined to. Use 'Assets' for full project access.",
        args: [{ name: "root", type: "string", required: true, description: "Project-relative folder under Assets/, e.g. Assets/AgentWork." }],
      },
      {
        name: "create_folder",
        summary: "Create a folder under the authoring root (creates intermediate folders).",
        args: [{ name: "path", type: "string", required: true, description: "Folder path relative to the authoring root." }],
      },
      {
        name: "create_asset",
        summary: "Create a new ScriptableObject (or other UnityEngine.Object) asset of the given type at a path.",
        args: [
          { name: "path", type: "string", required: true, description: "Asset path relative to the authoring root, including extension." },
          { name: "type", type: "string", required: true, description: "Fully-qualified or short type name to instantiate. Must derive from UnityEngine.Object." },
          { name: "shader", type: "string", description: "Material-only: shader name to assign. Defaults to a URP/Standard shader as appropriate." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Required only when overwriting an existing asset at the path." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate without writing anything." },
        ],
      },
      {
        name: "import_asset",
        summary: "Import an external file (texture, model, audio clip...) by copying it into the project, then importing it.",
        args: [
          { name: "source", type: "string", required: true, description: "Absolute filesystem path to the external file." },
          { name: "path", type: "string", required: true, description: "Destination asset path relative to the authoring root, including extension." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Required only when overwriting an existing asset at the destination." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate without writing anything." },
        ],
      },
      {
        name: "copy_asset",
        summary: "Copy an asset to a new path under the authoring root. The copy gets a fresh GUID.",
        args: [
          { name: "asset", type: "objectref", required: true, description: "Reference to the asset to copy." },
          { name: "destination", type: "string", required: true, description: "Destination asset path, including extension." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Required only when overwriting an existing asset at the destination." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate without writing anything." },
        ],
      },
      {
        name: "move_asset",
        summary: "Move (or rename via a new path) an asset. Preserves the asset's GUID.",
        args: [
          { name: "asset", type: "objectref", required: true, description: "Reference to the asset to move." },
          { name: "destination", type: "string", required: true, description: "Destination asset path, including extension." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate the move without performing it." },
        ],
      },
      {
        name: "rename_asset",
        summary: "Rename an asset in place — keeps it in the same folder, keeps its GUID.",
        args: [
          { name: "asset", type: "objectref", required: true, description: "Reference to the asset to rename." },
          { name: "new_name", type: "string", required: true, description: "New file name without a folder path." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate without performing it." },
        ],
      },
      {
        name: "delete_asset",
        summary: "Delete an asset from the project. Destructive: requires confirm=true.",
        notUndoable: true,
        args: [
          { name: "asset", type: "objectref", required: true, description: "Reference to the asset to delete." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Must be true to actually delete." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Report what would be deleted without deleting it." },
        ],
      },
      {
        name: "find_assets",
        summary: "Find assets by type and/or name and/or label, returning path, GUID and type. At least one filter is required.",
        args: [
          { name: "type", type: "string", description: "Type name to filter by (e.g. Material, GameObject, ScriptableObject)." },
          { name: "name", type: "string", description: "Name substring to filter by." },
          { name: "label", type: "string", description: "Asset label to filter by." },
          { name: "search_in", type: "string", description: "Folder to scope the search to. Defaults to the authoring root." },
          { name: "limit", type: "int", defaultValue: "200", description: "Maximum number of results." },
        ],
      },
      {
        name: "get_import_settings",
        summary: "Read an asset's import settings, structured by importer type (texture/model/audio), including one platform override block.",
        args: [
          { name: "asset", type: "objectref", required: true, description: "Reference to the asset whose importer to read." },
          { name: "platform", type: "string", defaultValue: "Default", description: "Platform whose override to read: Default | Standalone | iOS | Android | WebGL | tvOS." },
        ],
      },
      {
        name: "set_import_settings",
        summary: "Set import settings on an asset's AssetImporter and re-import it.",
        args: [
          { name: "asset", type: "objectref", required: true, description: "Reference to the asset whose importer to edit." },
          { name: "settings", type: "jobject", required: true, description: 'Property/field names to values, e.g. {"isReadable": true, "textureType": "NormalMap"}.' },
          { name: "platform", type: "string", defaultValue: "Default", description: "A real platform writes a per-platform override (textures/audio only)." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate which settings would apply without writing or re-importing." },
        ],
      },
      {
        name: "read_text_file",
        summary: "Read a UTF-8 text file under the authoring root and return its contents.",
        args: [
          { name: "path", type: "string", required: true, description: "Text file path relative to the authoring root." },
          { name: "max_bytes", type: "int", defaultValue: "1048576", description: "Reject files larger than this many bytes (default 1 MiB)." },
        ],
      },
      {
        name: "write_text_file",
        summary: "Write UTF-8 text to a file under the authoring root, then import it. Overwriting requires confirm=true.",
        args: [
          { name: "path", type: "string", required: true, description: "Text file path relative to the authoring root, including extension." },
          { name: "contents", type: "string", required: true, description: "The full text content to write (replaces the file)." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Required only when overwriting an existing file." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate without writing anything." },
        ],
      },
    ],
    example: {
      title: "Bring in a texture and set it up correctly",
      narrative: "Importing external art and configuring it the way you would by hand in the Inspector, in two calls instead of several clicks.",
      steps: [
        { command: 'unity command import_asset --source "C:/Art/crate_albedo.png" --path Textures/Crate_Albedo.png' },
        { command: 'unity command set_import_settings --asset Textures/Crate_Albedo.png --settings "{\\"textureType\\":\\"Default\\",\\"maxTextureSize\\":1024}"' },
        { command: "unity command find_assets --type Texture2D --name Crate", note: "confirm it landed where expected" },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "prefabs",
    title: "Prefabs",
    intro:
      "Turn a GameObject into a reusable prefab, spin up instances of it, and keep instances and their source asset in sync — the same relationship the Prefab Overrides UI manages, just callable.",
    commands: [
      {
        name: "create_prefab",
        summary: "Save a GameObject as a prefab asset at a project path; the source becomes a connected instance.",
        args: [
          { name: "source", type: "objectref", required: true, description: "Reference to the source GameObject to save as a prefab." },
          { name: "path", type: "string", required: true, description: "Prefab asset path relative to the authoring root; .prefab added if missing." },
        ],
      },
      {
        name: "create_prefab_variant",
        summary: "Create a prefab variant asset that inherits from a base prefab.",
        args: [
          { name: "base", type: "objectref", required: true, description: "Reference to the base prefab asset." },
          { name: "path", type: "string", required: true, description: "Variant prefab asset path; .prefab added if missing." },
        ],
      },
      {
        name: "instantiate_prefab",
        summary: "Instantiate a prefab asset into a loaded scene and return the created instance.",
        args: [
          { name: "prefab", type: "objectref", required: true, description: "Reference to the prefab asset to instantiate." },
          { name: "scene_path", type: "string", description: "Optional path of a loaded scene to instantiate into. Defaults to the active scene." },
          { name: "name", type: "string", description: "Optional name for the created instance; defaults to the prefab name." },
        ],
      },
      {
        name: "apply_prefab_overrides",
        summary: "Apply a prefab instance's overrides back to its source prefab asset.",
        args: [{ name: "instance", type: "objectref", required: true, description: "Reference to a prefab instance GameObject in a scene." }],
      },
      {
        name: "revert_prefab_overrides",
        summary: "Revert a prefab instance's overrides so it matches its source prefab asset.",
        args: [{ name: "instance", type: "objectref", required: true, description: "Reference to a prefab instance GameObject in a scene." }],
      },
      {
        name: "unpack_prefab",
        summary: "Unpack a prefab instance into plain GameObjects (outermost level or completely).",
        args: [
          { name: "instance", type: "objectref", required: true, description: "Reference to a prefab instance GameObject in a scene." },
          { name: "completely", type: "bool", defaultValue: "false", description: "If true, unpack all nested prefab levels; if false, only the outermost level." },
        ],
      },
      {
        name: "save_prefab_contents",
        summary: "Open a prefab in an isolated prefab stage, apply a declarative edit, and save it back (nested-prefab safe).",
        args: [
          { name: "prefab", type: "objectref", required: true, description: "Reference to the prefab asset to edit." },
          { name: "rename_child", type: "string", description: "Optional child name (relative path, e.g. 'Body/Head') to rename." },
          { name: "new_name", type: "string", description: "New name for the child identified by rename_child." },
          { name: "set_active_child", type: "string", description: "Optional child name whose active state to set." },
          { name: "active", type: "bool", defaultValue: "true", description: "Active state to apply when set_active_child is provided." },
        ],
      },
    ],
    example: {
      title: "Turn a hand-built enemy into a reusable prefab",
      narrative: "The most common prefab workflow: build one instance, promote it, spawn copies, then push a tweak on one instance back to every copy that shares it.",
      steps: [
        { command: "unity command create_prefab --source Enemy --path Prefabs/Enemy" },
        { command: "unity command instantiate_prefab --prefab Prefabs/Enemy --name Enemy_Wave1_1" },
        { command: "unity command instantiate_prefab --prefab Prefabs/Enemy --name Enemy_Wave1_2" },
        { command: "unity command apply_prefab_overrides --instance Enemy_Wave1_1", note: "after tweaking just that instance, push the change back to the shared prefab" },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "materials",
    title: "Materials & Shaders",
    intro: "Read and write what a material actually looks like — its shader, keywords, render queue, and every exposed property — plus discover which shaders exist to assign in the first place.",
    commands: [
      {
        name: "get_material_properties",
        summary: "Read a material's shader, render queue, enabled keywords, and all shader properties with current values.",
        args: [{ name: "material", type: "objectref", required: true, description: "Reference to the .mat asset (or a loaded material)." }],
      },
      {
        name: "set_material_properties",
        summary:
          "Set shader properties on a material (Float/Range/Int=number; Color=[r,g,b,a] or hex; Vector=[x,y,z,w]; Texture=ref or null), optionally reassign the shader, set render queue, toggle keywords.",
        args: [
          { name: "material", type: "objectref", required: true, description: "Reference to the .mat asset (or a loaded material)." },
          { name: "shader", type: "string", description: "Reassign the shader by name. Applied before properties." },
          { name: "properties", type: "jobject", description: "Shader property name -> value. Names include the leading underscore (e.g. _BaseColor)." },
          { name: "renderQueue", type: "nullable`1", description: "Explicit render queue, or -1 to inherit from the shader." },
          { name: "enableKeywords", type: "string[]", description: "Shader keywords to enable (e.g. _NORMALMAP, _EMISSION)." },
          { name: "disableKeywords", type: "string[]", description: "Shader keywords to disable." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate and report applied[]/unknown[] without writing anything." },
        ],
      },
      {
        name: "get_shader_properties",
        summary: "Introspect a shader's declared property list (name, type, range, texture dimension, flags). Provide 'shader' by name OR 'material'.",
        args: [
          { name: "shader", type: "string", description: "Shader name (e.g. \"Universal Render Pipeline/Lit\"). Provide this OR 'material'." },
          { name: "material", type: "objectref", description: "Reference to a material to read the shader from instead of naming it." },
        ],
      },
      {
        name: "list_shaders",
        summary: "Discover available shaders so an agent can pick a valid name for set_material_properties / create_asset.",
        args: [
          { name: "filter", type: "string", description: 'Case-insensitive substring matched against the shader name (e.g. "URP", "Lit").' },
          { name: "includeBuiltin", type: "bool", defaultValue: "true", description: "Include built-in/engine shaders." },
          { name: "limit", type: "int", defaultValue: "200", description: "Maximum number of shaders to return." },
        ],
      },
    ],
    example: {
      title: "Retint a material without opening the Inspector",
      narrative: "Find out what a shader actually exposes before guessing property names, then set a color and toggle an emission keyword.",
      steps: [
        { command: "unity command get_shader_properties --shader \"Universal Render Pipeline/Lit\"", note: "confirm the exact property names first" },
        { command: 'unity command set_material_properties --material Materials/Crate --properties "{\\"_BaseColor\\":\\"#F2B705FF\\"}" --enableKeywords _EMISSION' },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "animation",
    title: "Animation Clips",
    intro: "Author AnimationClip curves directly — create a clip, then add, read, or remove the float curves that drive it — without touching the Animation window.",
    commands: [
      {
        name: "create_animation_clip",
        summary: "Create an empty .anim AnimationClip asset, with an optional frame rate and loop flag.",
        args: [
          { name: "path", type: "string", required: true, description: "Asset path ending in .anim, relative to the authoring root." },
          { name: "frameRate", type: "float", defaultValue: "60", description: "Sampling frame rate of the clip." },
          { name: "loop", type: "bool", defaultValue: "false", description: "If true, set the clip's loop-time flag." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Required only when overwriting an existing asset." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate without writing anything." },
        ],
      },
      {
        name: "get_animation_clip",
        summary: "Read an AnimationClip's metadata and all float curve bindings (optionally with keyframes).",
        args: [
          { name: "clip", type: "objectref", required: true, description: "Reference to the AnimationClip to read." },
          { name: "includeKeys", type: "bool", defaultValue: "false", description: "If true, include each binding's keyframes." },
        ],
      },
      {
        name: "set_animation_curve",
        summary: "Add or replace a single float curve binding on an AnimationClip. Replacing an existing binding overwrites it.",
        args: [
          { name: "clip", type: "objectref", required: true, description: "Reference to the AnimationClip to edit." },
          { name: "path", type: "string", defaultValue: "", description: "GameObject path relative to the animated root. Empty targets the root." },
          { name: "type", type: "string", required: true, description: 'Component type the property lives on, e.g. "Transform", "UnityEngine.Light".' },
          { name: "property", type: "string", required: true, description: 'Curve property name, e.g. "m_LocalPosition.x".' },
          { name: "keys", type: "jarray", required: true, description: "Keyframes: [{ time, value, inTangent?, outTangent?, weightedMode? }]." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate type/property/keys without writing the curve." },
        ],
      },
      {
        name: "remove_animation_curve",
        summary: "Remove a float curve binding from an AnimationClip. Destructive: requires confirm=true.",
        notUndoable: true,
        args: [
          { name: "clip", type: "objectref", required: true, description: "Reference to the AnimationClip to edit." },
          { name: "path", type: "string", defaultValue: "", description: "GameObject path the binding lives on. Empty targets the root." },
          { name: "type", type: "string", required: true, description: "Component type of the binding to remove." },
          { name: "property", type: "string", required: true, description: "Curve property name to remove." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Must be true to actually remove the binding." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Report the binding that would be removed without removing it." },
        ],
      },
    ],
    example: {
      title: "Author a two-key bob animation by hand",
      narrative: "A clip that moves an object up and down — the kind of thing you'd normally drag keyframes for in the Animation window.",
      steps: [
        { command: "unity command create_animation_clip --path Animations/Bob.anim --loop true" },
        {
          command:
            'unity command set_animation_curve --clip Animations/Bob.anim --type Transform --property "m_LocalPosition.y" --keys "[{\\"time\\":0,\\"value\\":0},{\\"time\\":0.5,\\"value\\":0.3},{\\"time\\":1,\\"value\\":0}]"',
        },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "animator",
    title: "Animator Controllers",
    intro:
      "Build the state machine that consumes those clips: layers, parameters, states, and the transitions between them, with the same validation the Animator window applies (does the state exist, does the parameter exist, does its type match the condition).",
    commands: [
      {
        name: "create_animator_controller",
        summary: "Create an .controller AnimatorController asset (with a default Base Layer).",
        args: [
          { name: "path", type: "string", required: true, description: "Asset path ending in .controller." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Required only when overwriting an existing asset." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate without writing anything." },
        ],
      },
      {
        name: "get_animator_controller",
        summary: "Read an AnimatorController's full structure: parameters, layers, states (motion/default), and transitions (with conditions).",
        args: [{ name: "controller", type: "objectref", required: true, description: "Reference to the AnimatorController to read." }],
      },
      {
        name: "add_animator_layer",
        summary: "Add a layer to an AnimatorController.",
        args: [
          { name: "controller", type: "objectref", required: true, description: "Reference to the AnimatorController to edit." },
          { name: "name", type: "string", required: true, description: "Layer name." },
          { name: "weight", type: "float", defaultValue: "1", description: "Layer weight." },
          { name: "blendingMode", type: "string", defaultValue: "Override", description: "Blending mode: Override | Additive." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate without writing the layer." },
        ],
      },
      {
        name: "add_animator_parameter",
        summary: "Add a parameter (Float | Int | Bool | Trigger) to an AnimatorController. A duplicate name returns 'duplicate_parameter'.",
        args: [
          { name: "controller", type: "objectref", required: true, description: "Reference to the AnimatorController to edit." },
          { name: "name", type: "string", required: true, description: "Parameter name." },
          { name: "type", type: "string", required: true, description: "Parameter type: Float | Int | Bool | Trigger." },
          { name: "defaultValue", type: "jtoken", description: "Default value for Float/Int/Bool (ignored for Trigger)." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate without writing the parameter." },
        ],
      },
      {
        name: "add_animator_state",
        summary: "Add a state to a layer, optionally with a motion (clip/blend tree) and as the layer default.",
        args: [
          { name: "controller", type: "objectref", required: true, description: "Reference to the AnimatorController to edit." },
          { name: "layer", type: "jtoken", description: "Layer index (int) or name (string). Default 0 (Base Layer)." },
          { name: "name", type: "string", required: true, description: "State name." },
          { name: "motion", type: "objectref", description: "Optional AnimationClip or BlendTree asset to assign as the state's motion." },
          { name: "isDefault", type: "bool", defaultValue: "false", description: "If true, set this state as the layer's default state." },
          { name: "position", type: "jarray", description: "Optional [x, y] node position in the graph (cosmetic)." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate without writing the state." },
        ],
      },
      {
        name: "add_animator_transition",
        summary:
          "Add a transition between two states (or from AnyState/Entry, to Exit) on a layer, with optional conditions. Validates states and each condition's parameter/mode.",
        args: [
          { name: "controller", type: "objectref", required: true, description: "Reference to the AnimatorController to edit." },
          { name: "layer", type: "jtoken", description: "Layer index or name. Default 0 (Base Layer)." },
          { name: "fromState", type: "string", required: true, description: 'Source state name, or "AnyState" / "Entry".' },
          { name: "toState", type: "string", required: true, description: 'Destination state name, or "Exit".' },
          { name: "conditions", type: "jarray", description: 'Optional: [{ parameter, mode: "If"|"IfNot"|"Greater"|"Less"|"Equals"|"NotEqual", threshold? }].' },
          { name: "hasExitTime", type: "bool", defaultValue: "false", description: "If true, the transition uses exit time." },
          { name: "exitTime", type: "float", defaultValue: "0", description: "Normalized exit time (0..1) when hasExitTime is set." },
          { name: "duration", type: "float", defaultValue: "0.25", description: "Transition duration in seconds." },
          { name: "hasFixedDuration", type: "bool", defaultValue: "true", description: "If true, duration is in seconds; otherwise normalized." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate everything without writing the transition." },
        ],
      },
    ],
    example: {
      title: "Wire up an Idle → Run state machine",
      narrative: "The minimum viable Animator setup: a speed parameter, two states, and a transition gated on that parameter — no mouse required.",
      steps: [
        { command: "unity command create_animator_controller --path Animators/Player.controller" },
        { command: 'unity command add_animator_parameter --controller Animators/Player.controller --name Speed --type Float --defaultValue 0' },
        { command: "unity command add_animator_state --controller Animators/Player.controller --name Idle --isDefault true" },
        { command: "unity command add_animator_state --controller Animators/Player.controller --name Run" },
        {
          command:
            'unity command add_animator_transition --controller Animators/Player.controller --fromState Idle --toState Run --conditions "[{\\"parameter\\":\\"Speed\\",\\"mode\\":\\"Greater\\",\\"threshold\\":0.1}]"',
        },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "timeline",
    title: "Timeline",
    intro: "Author cutscenes and sequenced audio the same declarative way — create a TimelineAsset, add tracks, drop clips on them. Requires the com.unity.timeline package.",
    commands: [
      {
        name: "create_timeline",
        summary: "Create a .playable TimelineAsset (optional frame rate). Requires com.unity.timeline.",
        args: [
          { name: "path", type: "string", required: true, description: "Asset path ending in .playable." },
          { name: "frameRate", type: "float", defaultValue: "60", description: "Timeline frame rate." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Required only when overwriting an existing asset." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate without writing anything." },
        ],
      },
      {
        name: "get_timeline",
        summary: "Read a TimelineAsset's structure: frame rate, duration, and its tracks with their clips.",
        args: [{ name: "timeline", type: "objectref", required: true, description: "Reference to the TimelineAsset to read." }],
      },
      {
        name: "add_timeline_track",
        summary: "Add a track (Animation | Audio | Activation | Control | Playable | Signal | Marker), optionally nested under a parent group/track.",
        args: [
          { name: "timeline", type: "objectref", required: true, description: "Reference to the TimelineAsset to edit." },
          { name: "trackType", type: "string", required: true, description: "Track type: Animation | Audio | Activation | Control | Playable | Signal | Marker." },
          { name: "name", type: "string", description: "Optional track display name." },
          { name: "parentTrack", type: "string", description: "Optional name of an existing group/track to nest under." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate without writing the track." },
        ],
      },
      {
        name: "add_timeline_clip",
        summary: "Add a clip to a named track. Animation tracks take an AnimationClip; Audio tracks take an AudioClip.",
        args: [
          { name: "timeline", type: "objectref", required: true, description: "Reference to the TimelineAsset to edit." },
          { name: "track", type: "string", required: true, description: "Target track name." },
          { name: "start", type: "float", required: true, description: "Clip start time in seconds." },
          { name: "duration", type: "float", required: true, description: "Clip duration in seconds." },
          { name: "asset", type: "objectref", description: "Source asset — required for Animation/Audio track types." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate without writing the clip." },
        ],
      },
    ],
    example: {
      title: "Assemble a two-second intro beat",
      narrative: "One animation track and one audio track, each with a single clip — the skeleton of every cutscene you'll build this way.",
      steps: [
        { command: "unity command create_timeline --path Timelines/Intro.playable" },
        { command: "unity command add_timeline_track --timeline Timelines/Intro.playable --trackType Animation --name CameraMove" },
        { command: "unity command add_timeline_track --timeline Timelines/Intro.playable --trackType Audio --name Sting" },
        { command: "unity command add_timeline_clip --timeline Timelines/Intro.playable --track CameraMove --start 0 --duration 2 --asset Animations/CameraPan.anim" },
        { command: "unity command add_timeline_clip --timeline Timelines/Intro.playable --track Sting --start 0 --duration 1.5 --asset Audio/Sting.wav" },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "scripting",
    title: "Scripting & Live Code",
    intro:
      "The most powerful — and most dangerous — category. create_script writes a normal file that goes through the ordinary compile pipeline. eval/run_script/reload_file execute arbitrary C# directly, at varying speeds and safety levels: eval for one-off snippets, run_script for a compiled file with an entry point, reload_file for hot-patching methods on already-loaded types without a full domain reload.",
    commands: [
      {
        name: "create_script",
        summary:
          "Create a new C# script (default base class MonoBehaviour) from a template. The type doesn't exist until a recompile completes — recompile, poll recompile_status, then attach_script.",
        args: [
          { name: "name", type: "string", required: true, description: "Class/file name without extension, e.g. PlayerController. Must be a valid C# identifier." },
          { name: "path", type: "string", description: "Folder to write the .cs into. Defaults to the authoring root." },
          { name: "namespace", type: "string", description: "Optional namespace to wrap the class in." },
          { name: "base_class", type: "string", defaultValue: "MonoBehaviour", description: "Base class to derive from." },
          { name: "overwrite", type: "bool", defaultValue: "false", description: "Overwrite the file if it already exists." },
        ],
      },
      { name: "recompile", summary: "Force a script recompile (works while unfocused/minimized). Poll recompile_status for completion.", async: true, args: [{ name: "focus", type: "bool", defaultValue: "false", description: "If true, bring the Editor to the foreground before compiling." }] },
      { name: "recompile_status", summary: "Get the status of the last recompile: idle | triggered | compiling | completed | up_to_date.", args: [] },
      {
        name: "eval",
        summary: "Evaluate C# code dynamically using the Roslyn compiler. Fastest way to run a one-off snippet.",
        args: [
          { name: "code", type: "string", required: true, description: "C# code to evaluate." },
          { name: "timeout", type: "int", defaultValue: "5000", description: "Timeout in milliseconds." },
        ],
      },
      {
        name: "eval_file",
        summary: "Evaluate C# code read from a .cs file on disk.",
        args: [
          { name: "file", type: "string", required: true, description: "Path to a .cs file to evaluate." },
          { name: "timeout", type: "int", defaultValue: "5000", description: "Timeout in milliseconds." },
        ],
      },
      {
        name: "run_script",
        summary: "Compile a project C# file in memory (no domain reload) and execute a named static entry point. Still arbitrary code execution — shares eval's capability gate.",
        args: [
          { name: "file", type: "string", required: true, description: "Path to a .cs file to compile. Relative paths resolve against the project root, and may live outside Assets/." },
          { name: "entry", type: "string", description: "Entry point as Namespace.Type.Method. Defaults to the single public static method, else Main." },
          { name: "args", type: "jarray", description: "JSON array of arguments passed to the entry point, coerced to its parameter types." },
          { name: "mode", type: "string", defaultValue: "ephemeral", description: "ephemeral (default): compile, run, discard. hotpatch: apply [CodeReload] replacements to loaded types." },
          { name: "references", type: "string[]", description: "Extra assembly name prefixes to reference beyond the auto-resolved set." },
          { name: "defines", type: "string[]", description: "Extra scripting define symbols for the compilation's #if directives." },
          { name: "pdb", type: "bool", defaultValue: "false", description: "Emit a portable PDB so breakpoints bind and stack traces map to file:line." },
          { name: "timeout_ms", type: "int", defaultValue: "30000", description: "Timeout for the dispatcher wait (and, for async entry points, the awaited Task)." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Compile only — return diagnostics, execute nothing." },
        ],
      },
      {
        name: "reload_file",
        summary: "Compile and apply in-place [CodeReload] edits from a source file — hot-patches methods on already-loaded types.",
        args: [
          { name: "filename", type: "string", required: true, description: "Source file containing [CodeReload] methods (e.g. Assets/Scripts/Player.cs)." },
          { name: "timeout", type: "int", defaultValue: "30000", description: "Compilation timeout in milliseconds." },
          { name: "assemblyDir", type: "string", description: "Directory to save compiled assemblies to disk (default in-memory only)." },
          { name: "pdb", type: "bool", defaultValue: "false", description: "Emit debug symbols mapped to the original source. Compiles unoptimized." },
        ],
      },
      {
        name: "reload_file_editor_interpreter",
        summary: "Compile in-place [CodeReload] edits and run them through an IL interpreter in this process instead of Assembly.Load — IL2CPP-safe.",
        args: [
          { name: "filename", type: "string", required: true, description: "Source file containing [CodeReload] methods." },
          { name: "timeout", type: "int", defaultValue: "30000", description: "Compilation timeout in milliseconds." },
          { name: "assemblyDir", type: "string", description: "Directory to save compiled assemblies to disk." },
          { name: "pdb", type: "bool", defaultValue: "false", description: "Emit debug symbols mapped to the original source." },
        ],
      },
      {
        name: "reload_file_player_interpreter",
        summary: "Compile a file's (or folder's) [CodeReload] method(s) and push the IL to a connected player over PlayerConnection — IL2CPP-safe.",
        args: [
          { name: "filename", type: "string", required: true, description: "Source .cs file or folder containing [CodeReload] methods." },
          { name: "player", type: "int", defaultValue: "-1", description: "Target connected player id; -1 broadcasts to all connected players." },
        ],
      },
      { name: "cleanup_codereload", summary: "Remove old code-reload DLL versions and clear the registry.", args: [{ name: "assemblyDir", type: "string", required: true, description: "Directory containing assemblies to clean up." }, { name: "force_domain_reload", type: "bool", defaultValue: "true", description: "Force a domain reload after cleanup." }] },
      { name: "codereload_status", summary: "Show current code-reload registry status and statistics.", args: [] },
      {
        name: "report_evals",
        summary: "Aggregate local eval-usage telemetry into a ranked report: API fingerprint frequency, one-liner percentage, error rate, and command-coverage suggestions.",
        args: [{ name: "top", type: "int", defaultValue: "50", description: "Maximum entries in each ranked list." }],
      },
    ],
    example: {
      title: "Iterate on gameplay code without a full recompile cycle",
      narrative:
        "eval for a quick check, then create_script + recompile for something that should stick around as a real file, then reload_file to hot-patch one method during iteration.",
      steps: [
        { command: 'unity command eval --code "UnityEngine.Debug.Log(UnityEngine.Time.timeScale);"', note: "instant sanity check, nothing saved to disk" },
        { command: "unity command create_script --name Waypoint --base_class MonoBehaviour" },
        { command: "unity command recompile" },
        { command: "unity command recompile_status", note: "poll until 'completed'" },
        { command: "unity command reload_file --filename Assets/Scripts/Waypoint.cs", note: "after marking a method [CodeReload], patch it in place without a domain reload" },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "project-settings",
    title: "Project Settings",
    intro:
      "One get_* / set_* pair per Project Settings page — Audio, Physics, Time, Quality, Graphics, Input, Tags & Layers, Player, NavMesh (legacy), Lighting, and this Pipeline package's own runtime settings. Every setter follows the same shape: pass only the fields you want to change, everything else is left alone, and it's gated behind confirm=true (with dry_run to preview) because none of these are undoable via Ctrl+Z.",
    commands: [
      { name: "get_audio_settings", summary: "Read project Audio settings (volume, rolloff scale, doppler factor).", args: [] },
      {
        name: "set_audio_settings",
        summary: "Change project Audio settings. Not undoable via Ctrl+Z.",
        notUndoable: true,
        args: [
          { name: "settings", type: "audiosettingsinput", description: "Fields to change; omitted fields are left unchanged." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Apply the change." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Preview the change without applying it." },
        ],
      },
      { name: "get_physics_settings", summary: "Read Physics settings (gravity, solver iterations, bounce threshold).", args: [] },
      {
        name: "set_physics_settings",
        summary: "Change Physics settings. Not undoable via Ctrl+Z.",
        notUndoable: true,
        args: [
          { name: "settings", type: "physicssettingsinput", description: "Fields to change; omitted fields are left unchanged." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Apply the change." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Preview the change without applying it." },
        ],
      },
      { name: "get_time_settings", summary: "Read Time settings (fixedDeltaTime, maximumDeltaTime, timeScale).", args: [] },
      {
        name: "set_time_settings",
        summary: "Change Time settings. Not undoable via Ctrl+Z.",
        notUndoable: true,
        args: [
          { name: "settings", type: "timesettingsinput", description: "Fields to change; omitted fields are left unchanged." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Apply the change." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Preview the change without applying it." },
        ],
      },
      { name: "get_quality_settings", summary: "Read QualitySettings (current level, level names, vSync, anti-aliasing).", args: [] },
      {
        name: "set_quality_settings",
        summary: "Change QualitySettings. Not undoable via Ctrl+Z.",
        notUndoable: true,
        args: [
          { name: "settings", type: "qualitysettingsinput", description: "Fields to change; omitted fields are left unchanged." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Apply the change." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Preview the change without applying it." },
        ],
      },
      { name: "get_graphics_settings", summary: "Read GraphicsSettings (default render pipeline).", args: [] },
      {
        name: "set_graphics_settings",
        summary: "Set the default render pipeline asset. Not undoable via Ctrl+Z.",
        notUndoable: true,
        args: [
          { name: "settings", type: "graphicssettingsinput", description: "Fields to change; omitted fields are left unchanged." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Apply the change." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Preview the change without applying it." },
        ],
      },
      { name: "get_input_settings", summary: "Read the legacy Input Manager axes (names and count).", args: [] },
      {
        name: "set_input_settings",
        summary: "Tune a legacy Input Manager axis (sensitivity/gravity/dead) by name. Not undoable via Ctrl+Z.",
        notUndoable: true,
        args: [
          { name: "settings", type: "inputaxisinput", description: "Axis change. 'axis' selects the axis by name; omitted numeric fields left unchanged." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Apply the change." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Preview the change without applying it." },
        ],
      },
      { name: "get_tags_layers", summary: "Read the project's tags and (named) layers.", args: [] },
      {
        name: "set_tags_layers",
        summary: "Add/remove tags and assign user layer names (index 8-31). Not undoable via Ctrl+Z.",
        notUndoable: true,
        args: [
          { name: "settings", type: "tagslayersinput", description: "Tag/layer changes to make." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Apply the change." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Preview the change without applying it." },
        ],
      },
      { name: "get_player_settings", summary: "Read PlayerSettings (company/product/version, scripting backend, API level).", args: [] },
      {
        name: "set_player_settings",
        summary: "Change PlayerSettings. Not undoable via Ctrl+Z. Scripting backend / API level changes trigger a domain reload.",
        notUndoable: true,
        args: [
          { name: "settings", type: "playersettingsinput", description: "Fields to change; omitted fields are left unchanged." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Apply the change." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Preview the change without applying it." },
        ],
      },
      { name: "get_navmesh_settings", summary: "Read the default agent's legacy NavMesh bake settings (radius/height/slope/climb, minRegionArea, voxelSize).", args: [] },
      {
        name: "set_navmesh_settings",
        summary: "Apply a subset of legacy NavMesh bake settings to the default agent. Returns { applied[], unknown[] }.",
        args: [
          { name: "settings", type: "jobject", required: true, description: "JSON object with a subset of NavMesh fields (same names as get_navmesh_settings)." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate the keys without changing anything." },
        ],
      },
      { name: "get_lighting_settings", summary: "Read the active LightingSettings (lightmapper, bounces, resolution, directional mode, AO, etc.).", args: [] },
      {
        name: "set_lighting_settings",
        summary: "Apply a subset of lighting settings to the active LightingSettings. Returns { applied[], unknown[] }.",
        args: [
          { name: "settings", type: "jobject", required: true, description: "JSON object with a subset of lighting fields (same names/enums as get_lighting_settings)." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate the keys without changing anything." },
        ],
      },
      { name: "get_runtime_pipeline_settings", summary: "Read this Pipeline package's own runtime settings (enableInBuilds, port, timeouts, audit logging, autoStart, work-item cap).", args: [] },
      {
        name: "set_runtime_pipeline_settings",
        summary: "Change Pipeline Runtime settings. Refused during Play Mode (the running driver already loaded its settings).",
        notUndoable: true,
        args: [
          { name: "settings", type: "runtimepipelinesettingsinput", description: "Fields to change; omitted fields are left unchanged." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Apply the change." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Preview the change without applying it." },
        ],
      },
      { name: "get_build_settings", summary: "Read the current build configuration from EditorUserBuildSettings / EditorBuildSettings.", args: [] },
      {
        name: "set_build_settings",
        summary:
          "Set mutable EditorUserBuildSettings fields. Does NOT manage scenes (use add_scene_to_build / remove_scene_from_build) or switch target (use switch_build_target).",
        notUndoable: true,
        args: [
          { name: "settings", type: "setbuildsettingsinput", description: "Fields to change; omitted fields are left unchanged." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Apply the changes. Without it the call is refused." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Preview the change without applying it." },
        ],
      },
    ],
    example: {
      title: "Tune physics gravity and confirm it stuck",
      narrative: "The read-check-write-verify loop you'll use for every settings category: read first so you know the current shape, dry-run to sanity-check, then apply for real.",
      steps: [
        { command: "unity command get_physics_settings", note: "see the current shape before changing anything" },
        { command: 'unity command set_physics_settings --settings "{\\"gravity\\":[0,-15,0]}" --dry_run true', note: "preview only — nothing written yet" },
        { command: 'unity command set_physics_settings --settings "{\\"gravity\\":[0,-15,0]}" --confirm true' },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "build-packages",
    title: "Build & Packages",
    intro:
      "Kick off a real player build and manage UPM packages. Both are async by default — a build/package call returns immediately with a queued/in-progress state, and you poll the matching *_status command until it's completed.",
    commands: [
      {
        name: "build",
        summary:
          "Trigger an async Player build and report the full BuildReport once complete. Returns immediately (queued); poll build_status.",
        async: true,
        args: [
          { name: "target", type: "string", description: "BuildTarget name (e.g. StandaloneWindows64). Defaults to the active target. Must be installed." },
          { name: "outputPath", type: "string", description: "Output path. Defaults to the last/auto path." },
          { name: "profileName", type: "string", description: "Build Profile name to activate before building (Unity 6 only)." },
          { name: "options", type: "string[]", description: "BuildOptions names. Omit to get just DetailedBuildReport." },
          { name: "scenes", type: "string[]", description: "Scene asset paths to build. Defaults to EditorBuildSettings." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Acknowledge and run the build; without it the call is refused." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate target/outputPath/scenes without building." },
        ],
      },
      { name: "build_status", summary: "Status of the current/most recent build: idle | queued | building | completed, with the full BuildReport once completed.", args: [] },
      { name: "list_build_targets", summary: "List the known BuildTarget values with their group and whether build support is installed.", args: [] },
      { name: "list_build_profiles", summary: "List Build Profile assets in the project (Unity 6 only). Returns feature_unavailable on earlier versions.", args: [] },
      {
        name: "switch_build_target",
        summary: "Switch the active build target — destructive, long-running (triggers a full reimport + domain reload). Returns immediately; poll switch_build_target_status.",
        async: true,
        args: [
          { name: "target", type: "string", required: true, description: "BuildTarget name to switch to (must be installed; see list_build_targets)." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Apply the switch. Without it the call is refused." },
        ],
      },
      { name: "switch_build_target_status", summary: "Status of the last target switch: idle | switching | completed (with success + activeBuildTarget).", args: [] },
      {
        name: "package_add",
        summary: "Add a UPM package by name@version, git URL, or 'file:' local path. Async by default; a recompile/domain reload follows.",
        async: true,
        args: [
          { name: "identifier", type: "string", required: true, description: "Package to add: 'com.unity.foo@1.2.3', a git URL, or 'file:../Path'." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Apply the change. Without it the call is refused." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Preview the change without applying it." },
          { name: "wait", type: "bool", defaultValue: "false", description: "Block until the operation completes instead of polling package_status." },
        ],
      },
      {
        name: "package_remove",
        summary: "Remove a UPM package by name. Async by default; a recompile/domain reload follows.",
        async: true,
        args: [
          { name: "name", type: "string", required: true, description: "Package name to remove (e.g. com.unity.foo)." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Apply the change. Without it the call is refused." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Preview the change without applying it." },
          { name: "wait", type: "bool", defaultValue: "false", description: "Block until the operation completes instead of polling package_status." },
        ],
      },
      { name: "package_resolve", summary: "Resolve/refresh packages from the manifest (re-fetch and re-link). May trigger a recompile/domain reload.", async: true, args: [] },
      {
        name: "package_list",
        summary: "List packages by scope: installed (default) | available (registry) | all. Returns synchronously — available/all block until the registry query completes.",
        args: [
          { name: "scope", type: "string", defaultValue: "installed", description: "Which packages to list: installed | available | all." },
          { name: "include_indirect", type: "bool", defaultValue: "true", description: "Include indirect (transitive) installed dependencies." },
          { name: "offline", type: "bool", defaultValue: "false", description: "For available/all: query the local cache instead of the registry." },
        ],
      },
      {
        name: "package_search",
        summary: "Search packages available in the registry. Returns synchronously (blocks until the query completes).",
        args: [
          { name: "query", type: "string", description: "Package name to search for. Omit to list all available packages." },
          { name: "offline", type: "bool", defaultValue: "false", description: "Search the local cache only." },
        ],
      },
      { name: "package_status", summary: "Status of the last async package operation (add/remove/resolve): idle | in_progress | completed | failed.", args: [] },
    ],
    example: {
      title: "Add a package, then run a validated build",
      narrative: "The async job pattern shows up everywhere in this category — fire the call, poll the matching *_status until it settles, then move on.",
      steps: [
        { command: "unity command package_add --identifier com.unity.timeline --confirm true" },
        { command: "unity command package_status", note: "poll until 'completed'" },
        { command: 'unity command build --target StandaloneWindows64 --dry_run true', note: "validate scenes/target before spending minutes on a real build" },
        { command: "unity command build --target StandaloneWindows64 --confirm true" },
        { command: "unity command build_status", note: "poll until 'completed'; the full BuildReport comes back here" },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "baking",
    title: "Baking: Lighting, NavMesh & Occlusion",
    intro:
      "Three independent async bake pipelines that all follow the same shape: trigger, poll a *_status, optionally cancel mid-bake, and clear previously baked data with an explicit confirm.",
    commands: [
      {
        name: "bake_lighting",
        summary: "Trigger an async lightmap bake of the open scene(s). Returns immediately; poll lighting_bake_status.",
        async: true,
        args: [
          { name: "confirm", type: "bool", defaultValue: "false", description: "Recommended: a bake overwrites existing lightmap data." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate there is an open bakeable scene and return current settings without baking." },
        ],
      },
      { name: "lighting_bake_status", summary: "Get the status of the last lighting bake: idle | baking | completed.", args: [] },
      { name: "cancel_lighting_bake", summary: "Cancel an in-progress lighting bake.", args: [] },
      {
        name: "clear_baked_lighting",
        summary: "Clear baked lightmap data for the open scene(s). Destructive: requires confirm=true.",
        notUndoable: true,
        args: [
          { name: "confirm", type: "bool", defaultValue: "false", description: "Must be true to actually clear." },
          { name: "include_disk_cache", type: "bool", defaultValue: "false", description: "If true, also clear the GI disk cache." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Report what would be cleared without clearing." },
        ],
      },
      {
        name: "bake_navmesh",
        summary: "Trigger an async legacy NavMesh bake of the open scene(s). Returns immediately; poll navmesh_bake_status.",
        async: true,
        args: [
          { name: "confirm", type: "bool", defaultValue: "false", description: "Accepted for parity — a bake overwrites the existing NavMesh." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate there is an open scene and return current settings without baking." },
        ],
      },
      { name: "navmesh_bake_status", summary: "Get the status of the last NavMesh bake: idle | baking | completed.", args: [] },
      { name: "cancel_navmesh_bake", summary: "Cancel an in-progress NavMesh bake.", args: [] },
      {
        name: "clear_navmesh",
        summary: "Clear the baked NavMesh for the open scene(s). Destructive: requires confirm=true.",
        notUndoable: true,
        args: [
          { name: "confirm", type: "bool", defaultValue: "false", description: "Must be true to actually clear." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Report what would be cleared without clearing." },
        ],
      },
      { name: "bake_navmesh_surfaces", summary: "Bake NavMeshSurface components (AI Navigation package). v1 stub: returns package_not_found when the package is absent.", args: [] },
      {
        name: "bake_occlusion_culling",
        summary: "Trigger an async occlusion-culling bake of the open scene(s). Returns immediately; poll occlusion_bake_status.",
        async: true,
        args: [
          { name: "smallest_occluder", type: "float", description: "Smallest object that will occlude others (meters). Defaults to Unity's current value." },
          { name: "smallest_hole", type: "float", description: "Smallest gap geometry can have that the view can see through (meters)." },
          { name: "backface_threshold", type: "float", description: "Backface threshold (1-100); lower trims more backfaces." },
          { name: "confirm", type: "bool", defaultValue: "false", description: "Accepted for parity — a bake overwrites existing occlusion data." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Report the parameters that would be used without baking." },
        ],
      },
      { name: "occlusion_bake_status", summary: "Get the status of the last occlusion bake: idle | baking | completed.", args: [] },
      { name: "cancel_occlusion_bake", summary: "Cancel an in-progress occlusion bake.", args: [] },
      {
        name: "clear_occlusion_culling",
        summary: "Clear baked occlusion-culling data for the open scene(s). Destructive: requires confirm=true.",
        notUndoable: true,
        args: [
          { name: "confirm", type: "bool", defaultValue: "false", description: "Must be true to actually clear." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Report what would be cleared without clearing." },
        ],
      },
    ],
    example: {
      title: "Rebake lighting after moving the sun",
      narrative: "Clear stale data first so you're never looking at a mix of old and new bakes, then kick off the real bake and poll it to completion.",
      steps: [
        { command: "unity command clear_baked_lighting --confirm true" },
        { command: "unity command bake_lighting --confirm true" },
        { command: "unity command lighting_bake_status", note: "poll every few seconds until 'completed'" },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "testing",
    title: "Testing & Auditing",
    intro: "Run the Unity Test Framework and Project Auditor's static analysis from a script or an agent instead of the Test Runner window.",
    commands: [
      {
        name: "list_tests",
        summary: "List all available tests (EditMode and/or PlayMode) without running them.",
        args: [{ name: "mode", type: "string", defaultValue: "all", description: "Test mode: all, editor, playmode." }],
      },
      {
        name: "run_tests",
        summary: "Execute Unity tests with filtering options.",
        async: true,
        args: [
          { name: "mode", type: "string", defaultValue: "all", description: "Test mode: all, editor, playmode." },
          { name: "filter", type: "string", description: "Test name filter pattern (case-insensitive partial match)." },
          { name: "filter_type", type: "string", defaultValue: "testName", description: "Filter type: testName, assembly, category." },
          { name: "include_explicit", type: "bool", defaultValue: "false", description: "Include tests marked with [Explicit]." },
          { name: "async_tests", type: "bool", defaultValue: "false", description: "Run asynchronously — return immediately, poll test_status." },
          { name: "timeout", type: "int", defaultValue: "300", description: "Test execution timeout in seconds." },
        ],
      },
      { name: "test_status", summary: "Get status of running async test execution.", args: [] },
      { name: "cancel_tests", summary: "Cancel running test execution.", args: [] },
      {
        name: "audit",
        summary: "Run a Project Auditor static-analysis scan. Returns immediately; poll audit_status until completed, then read the CSV.",
        async: true,
        args: [
          { name: "categories", type: "string", description: "Comma-separated issue categories to scan (e.g. Code,ProjectSetting,Texture). Default: all." },
          { name: "output", type: "string", description: "CSV output path. Defaults to Temp/pipeline-audit/<scanId>.csv." },
        ],
      },
      { name: "audit_status", summary: "Get the status of the last audit: idle | scanning | completed | failed | interrupted | unavailable.", args: [] },
    ],
    example: {
      title: "Run a targeted test pass before committing",
      narrative: "Filter down to the tests relevant to what you just changed instead of a full suite run, then read the result.",
      steps: [
        { command: "unity command list_tests --mode editor", note: "see what's actually available first" },
        { command: "unity command run_tests --mode editor --filter Inventory --filter_type testName" },
        { command: "unity command test_status", note: "only needed if you passed async_tests true" },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "playmode",
    title: "Play Mode & Runtime Control",
    intro: "Drive the Editor's Play Mode itself and read live runtime state — the commands behind pressing the Play button, and the ones that read what's happening while it's playing.",
    commands: [
      { name: "editor_play", summary: "Enter Unity Editor play mode.", args: [] },
      { name: "editor_pause", summary: "Toggle pause state of Unity Editor play mode.", args: [] },
      { name: "editor_stop", summary: "Exit Unity Editor play mode.", args: [] },
      { name: "editor_focus", summary: "Bring the Unity Editor window to the foreground.", args: [] },
      { name: "editor_status", summary: "Get detailed Unity Editor status and state information.", args: [] },
      { name: "runtime_status", summary: "Get comprehensive runtime application status.", args: [] },
      { name: "get_performance_stats", summary: "Read render, memory, and frame-timing stats (structured, read-only).", args: [] },
      { name: "set_timescale", summary: "Set the time scale for the application.", args: [{ name: "scale", type: "float", required: true, description: "Time scale multiplier (0.0 to pause, 1.0 for normal speed)." }] },
      { name: "set_target_framerate", summary: "Set the target frame rate for the application.", args: [{ name: "frameRate", type: "int", required: true, description: "Target frame rate (-1 for platform default, 0 for unlimited)." }] },
      {
        name: "set_autotick",
        summary: "Keep the editor ticking while unfocused by forcing EditorApplication.SignalTick at a throttled rate.",
        args: [
          { name: "enable", type: "bool", defaultValue: "true", description: "Enable or disable auto-tick mode." },
          { name: "interval_ms", type: "int", defaultValue: "16", description: "Minimum milliseconds between forced ticks. 0 = max rate (pegs a CPU core)." },
          { name: "persist", type: "bool", defaultValue: "true", description: "Persist this choice so it survives a domain reload." },
        ],
      },
      { name: "quit", summary: "Gracefully quit the Unity application.", args: [{ name: "exitCode", type: "int", defaultValue: "0", description: "Exit code for the application." }] },
    ],
    example: {
      title: "Enter Play Mode, watch it run, then stop",
      narrative: "The basic loop for observing runtime behavior instead of guessing from static analysis of the scene.",
      steps: [
        { command: "unity command editor_play" },
        { command: "unity command runtime_status", note: "check what's actually happening while it's live" },
        { command: "unity command editor_stop" },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "input-simulation",
    title: "Input Simulation",
    intro: "Drive a running app's Input System directly — useful for scripted playtesting or reproducing a bug without a human at the keyboard.",
    commands: [
      {
        name: "simulate_key",
        summary: "Simulate a keyboard key event (Input System). Drives the running app.",
        args: [
          { name: "key", type: "string", required: true, description: "Input System Key name, e.g. Space, W, Enter, LeftArrow." },
          { name: "action", type: "string", defaultValue: "press", description: "down | up | press (down+up)." },
        ],
      },
      {
        name: "simulate_pointer",
        summary: "Simulate a mouse/pointer event at screen coordinates (Input System).",
        args: [
          { name: "x", type: "float", required: true, description: "Screen X in pixels (origin bottom-left)." },
          { name: "y", type: "float", required: true, description: "Screen Y in pixels (origin bottom-left)." },
          { name: "action", type: "string", defaultValue: "click", description: "move | down | up | click (down+up)." },
          { name: "button", type: "string", defaultValue: "left", description: "left | right | middle." },
        ],
      },
    ],
    example: {
      title: "Script a scripted playtest step",
      narrative: "Move the player forward and click a UI button, entirely from the terminal — handy for reproducing an input-dependent bug reliably.",
      steps: [
        { command: "unity command editor_play" },
        { command: "unity command simulate_key --key W --action press" },
        { command: "unity command simulate_pointer --x 640 --y 360 --action click" },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "capture",
    title: "Capture & Visual Debugging",
    intro: "Grab a PNG of what's actually on screen — the fastest way for an agent (or a script) to visually confirm a change without you tabbing over to look yourself.",
    commands: [
      {
        name: "capture_game_view",
        summary:
          "Capture the game view as a PNG. source=screen (default) captures what the Game window shows, including Overlay UI; source=camera renders a single camera and misses overlay UI.",
        args: [
          { name: "width", type: "int", defaultValue: "1280", description: "Output width in px (capped 4096)." },
          { name: "height", type: "int", defaultValue: "720", description: "Output height in px (capped 4096)." },
          { name: "camera", type: "string", description: "Optional camera name (source=camera only); defaults to Camera.main." },
          { name: "save_path", type: "string", description: "Optional project-relative path to write the PNG instead of returning inline base64." },
          { name: "include_inline_image", type: "bool", defaultValue: "false", description: "Also return the image inline as base64 when save_path is set." },
          { name: "max_resolution", type: "int", defaultValue: "0", description: "Cap on the inline image's longest edge." },
          { name: "source", type: "string", description: "'screen' (default) or 'camera'. Defaults to 'camera' when a camera name is given." },
        ],
      },
      {
        name: "capture_scene_view",
        summary: "Render the active Scene View to a PNG.",
        args: [
          { name: "width", type: "int", defaultValue: "1280", description: "Output width in px (capped 4096)." },
          { name: "height", type: "int", defaultValue: "720", description: "Output height in px (capped 4096)." },
          { name: "save_path", type: "string", description: "Optional project-relative path to write the PNG." },
          { name: "include_inline_image", type: "bool", defaultValue: "false", description: "Also return the image inline as base64 when save_path is set." },
          { name: "max_resolution", type: "int", defaultValue: "0", description: "Cap on the inline image's longest edge." },
        ],
      },
      {
        name: "screenshot",
        summary: "Capture the Scene or Game view as a PNG and return its file path.",
        args: [
          { name: "view", type: "string", defaultValue: "game", description: "Which view to capture: 'game' or 'scene'." },
          { name: "output", type: "string", description: "Output PNG path. Defaults to a timestamped file under Temp/pipeline-screenshots/." },
          { name: "width", type: "int", defaultValue: "0", description: "Output width in pixels. 0 uses the view camera's current width." },
          { name: "height", type: "int", defaultValue: "0", description: "Output height in pixels. 0 uses the view camera's current height." },
        ],
      },
    ],
    example: {
      title: "Visually confirm a change without leaving the terminal",
      narrative: "After moving a light or spawning an object, grab a screenshot to check it actually looks right instead of trusting the numbers alone.",
      steps: [
        { command: "unity command editor_play" },
        { command: "unity command capture_game_view --width 960 --height 540 --save_path Screenshots/after-fix.png" },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "console",
    title: "Console & Logging",
    intro: "Read and write the Unity console the same way a human would watch it — including a cursor-based 'tail -f' style follow mode.",
    commands: [
      {
        name: "log",
        summary: "Write a message to the Unity console.",
        args: [
          { name: "message", type: "string", required: true, description: "Message to log to console." },
          { name: "level", type: "string", defaultValue: "info", description: "Log level: info, warning, error." },
        ],
      },
      {
        name: "console",
        summary: "Get captured Unity console output (Editor or Player); supports tail, level filtering, and follow via a cursor.",
        args: [
          { name: "tail", type: "int", defaultValue: "100", description: "Maximum number of most-recent entries to return." },
          { name: "level", type: "string", defaultValue: "log", description: "Minimum severity to include: log | warn | error." },
          { name: "since", type: "long", defaultValue: "-1", description: "Cursor: only return entries newer than this seq. Use a previous response's cursor to follow." },
          { name: "since_session", type: "string", description: "Session the 'since' cursor came from — a cursor from another session resets with reset=true." },
        ],
      },
      { name: "console_status", summary: "Console ground truth without pulling entries: compile-failure flag, Editor console counts, buffer's retained counts and cursor.", args: [] },
      { name: "clear_console", summary: "Clear the captured log buffer and the Unity Editor console.", args: [] },
    ],
    example: {
      title: "Follow the console like tail -f",
      narrative: "Poll with the cursor from the previous response so you only ever see new entries — the pattern for watching a long-running operation's output live.",
      steps: [
        { command: "unity command console --tail 50", note: "note the 'cursor' value in the response" },
        { command: "unity command console --since 128 --since_session <session>", note: "only entries newer than seq 128 come back" },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "search-menu",
    title: "Search & Menu",
    intro: "Two escape hatches: run a real Unity Search query, or execute (or just list) any Editor menu item by path — for the one-off action that doesn't have its own dedicated command yet.",
    commands: [
      {
        name: "search",
        summary: "Run a Unity Search query and return structured results.",
        args: [
          { name: "query", type: "string", required: true, description: "Unity Search query string, e.g. 't:Material', 'p: my asset', 'h: Main Camera'." },
          { name: "limit", type: "int", defaultValue: "50", description: "Max results to return (capped 200)." },
        ],
      },
      {
        name: "menu",
        summary: "Execute an Editor menu item by path, or list available items when no path is given.",
        args: [{ name: "path", type: "string", description: 'Menu item path to execute, e.g. "Assets/Reimport All". Omit to list available menu items.' }],
      },
    ],
    example: {
      title: "Reach for a menu command with no dedicated tool",
      narrative: "Not every Editor action has its own command — menu is the fallback for the rest of the menu bar.",
      steps: [
        { command: "unity command menu", note: "no path — lists what's available" },
        { command: 'unity command menu --path "Assets/Reimport All"' },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "waiting",
    title: "Waiting / Async Polling",
    intro:
      "A general-purpose condition-wait, independent of any specific *_status command above — poll any member (static, or on an instance) until it satisfies a comparison, then optionally capture a screenshot or pause in the same frame it becomes true.",
    commands: [
      {
        name: "wait_for",
        summary:
          "Wait server-side until a member condition holds, then optionally act in the same frame. A sync wait holds the exec queue — keep it short, or set async=true and poll wait_status.",
        args: [
          { name: "condition", type: "waitconditioninput", required: true, description: "{ member, target?, findType?, op, value }. op is equals|notEquals|greaterThan|lessThan|contains|changed." },
          { name: "timeout_s", type: "double", defaultValue: "30", description: "Maximum seconds to wait (clamped 0-600)." },
          { name: "poll_interval_ms", type: "double", defaultValue: "100", description: "How often to re-check the condition, in ms (clamped 16-5000)." },
          { name: "on_met", type: "waitonmetinput", description: "Follow-up run in the same editor frame the condition first holds: { capture, pause }." },
          { name: "return_history", type: "bool", defaultValue: "false", description: "Include observed value/timestamp samples (ring buffer of the last 200)." },
          { name: "tolerate_missing", type: "bool", defaultValue: "false", description: "Treat resolution failures as condition-not-met and retry — waits for something to exist." },
          { name: "async", type: "bool", defaultValue: "false", description: "Return a wait_id immediately and evaluate in the background; poll wait_status." },
        ],
      },
      { name: "wait_status", summary: "Get the status/result of an async wait started with wait_for (async=true).", args: [{ name: "wait_id", type: "string", required: true, description: "The wait id returned by wait_for when async=true." }] },
      { name: "wait_cancel", summary: "Cancel an async wait started with wait_for (async=true).", args: [{ name: "wait_id", type: "string", required: true, description: "The wait id to cancel." }] },
    ],
    example: {
      title: "Wait for a spawned enemy to die, then screenshot the result",
      narrative: "Instead of polling runtime_status in a loop yourself, hand the condition to wait_for and let it notify you the moment it's true.",
      steps: [
        {
          command:
            'unity command wait_for --condition "{\\"member\\":\\"health\\",\\"findType\\":\\"EnemyController\\",\\"op\\":\\"lessThan\\",\\"value\\":1}" --async true',
          note: "returns a wait_id immediately",
        },
        { command: "unity command wait_status --wait_id <id>", note: "poll until it reports met" },
      ],
    },
  },

  // ---------------------------------------------------------------------
  {
    id: "batch",
    title: "Batch Operations",
    intro:
      "Run several registered commands as one transactional request instead of round-tripping the agent loop N times. Later ops can reference earlier results with \"$<id-or-index>.<jsonPath>\" — the closest thing to scripting the tool surface itself.",
    commands: [
      {
        name: "batch",
        summary:
          "Run multiple registered commands in one transactional request. transactional=true (default) groups every op into one Undo step and reverts all applied ops if any op fails; asset/file/settings-writing commands are rejected unless transactional=false.",
        args: [
          { name: "operations", type: "list`1", required: true, description: "Ordered operations to run; each is { id?, command, params }. Max 200." },
          {
            name: "transactional",
            type: "bool",
            defaultValue: "true",
            description: "Group all ops into one Undo step and revert every applied op if any op fails. Forced false when on_error=continue. Rejects non-revertible mutations.",
          },
          { name: "on_error", type: "string", defaultValue: "abort", description: "abort: stop at the first failure. continue: run every op, collecting per-op errors (forces transactional=false)." },
          { name: "dry_run", type: "bool", defaultValue: "false", description: "Validate command names, parameters, reference topology and exclusions without mutating anything." },
          { name: "result_fields", type: "jobject", description: "Optional per-op result projection: map of op id-or-index -> array of result field paths to keep." },
          { name: "time_budget_ms", type: "int", defaultValue: "50000", description: "Cooperative time budget for the whole batch (max 3600000). Exceeding it skips remaining ops and rolls back a transactional batch." },
        ],
      },
    ],
    example: {
      title: "Create, name, and select a GameObject in one round trip",
      narrative:
        'The signature batch move: op 1 creates something, op 2 references its result via "$0.instanceId" to act on the exact object just created — no separate find_gameobjects call needed in between.',
      steps: [
        {
          command:
            'unity command batch --operations "[{\\"id\\":\\"cube\\",\\"command\\":\\"create_gameobject\\",\\"params\\":{\\"name\\":\\"Loot\\",\\"primitive\\":\\"cube\\"}},{\\"command\\":\\"set_selection\\",\\"params\\":{\\"instance_ids\\":[\\"$cube.instanceId\\"]}}]"',
        },
      ],
    },
  },
];

export function findBuiltinCommand(name: string) {
  for (const category of builtinCategories) {
    const match = category.commands.find((c) => c.name === name);
    if (match) return { category, command: match };
  }
  return undefined;
}

export const builtinCommandCount = builtinCategories.reduce((sum, c) => sum + c.commands.length, 0);
