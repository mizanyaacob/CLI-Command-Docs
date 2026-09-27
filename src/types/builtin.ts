export interface BuiltinArg {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description: string;
}

export interface BuiltinCommand {
  name: string;
  summary: string;
  /** true when this returns immediately and must be polled via a *_status command */
  async?: boolean;
  /** true when calling this changes disk/asset state in a way Ctrl+Z cannot undo */
  notUndoable?: boolean;
  args: BuiltinArg[];
}

export interface WorkflowStep {
  command: string;
  note?: string;
}

export interface WorkflowExample {
  title: string;
  narrative: string;
  steps: WorkflowStep[];
}

export interface BuiltinCategory {
  id: string;
  title: string;
  intro: string;
  commands: BuiltinCommand[];
  example: WorkflowExample;
}
