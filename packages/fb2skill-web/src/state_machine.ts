// Ported from packages/fb2skill-core/src/fb2skill_core/state_machine.py.
// Kept in sync manually — if the Python tables change, mirror them here.

export const STATES = [
  "Idle",
  "Starting",
  "Execute",
  "Completing",
  "Complete",
  "Resetting",
  "Holding",
  "Held",
  "Unholding",
  "Suspending",
  "Suspended",
  "Unsuspending",
  "Stopping",
  "Stopped",
  "Aborting",
  "Aborted",
  "Clearing",
] as const;

export const COMMANDS = [
  "Start",
  "Reset",
  "Hold",
  "Unhold",
  "Suspend",
  "Unsuspend",
  "Clear",
  "Stop",
  "Abort",
] as const;

export const AUTO_TRANSITION_STATES = [
  "Starting",
  "Execute",
  "Completing",
  "Holding",
  "Unholding",
  "Suspending",
  "Unsuspending",
  "Resetting",
  "Stopping",
  "Clearing",
  "Aborting",
] as const;

export const COMMAND_TARGET: Record<string, string> = {
  StartCommand: "Starting",
  ResetCommand: "Resetting",
  HoldCommand: "Holding",
  UnholdCommand: "Unholding",
  SuspendCommand: "Suspending",
  UnsuspendCommand: "Unsuspending",
  ClearCommand: "Clearing",
  StopCommand: "Stopping",
  AbortCommand: "Aborting",
};

export const AUTO_TARGET: Record<string, string> = {
  Starting_State_Complete: "Execute",
  Execute_State_Complete: "Completing",
  Completing_State_Complete: "Complete",
  Holding_State_Complete: "Held",
  Unholding_State_Complete: "Execute",
  Suspending_State_Complete: "Suspended",
  Unsuspending_State_Complete: "Execute",
  Resetting_State_Complete: "Idle",
  Stopping_State_Complete: "Stopped",
  Clearing_State_Complete: "Stopped",
  Aborting_State_Complete: "Aborted",
};

export const STATE_OUTGOING: Record<string, readonly string[]> = {
  Idle: ["StartCommand", "StopCommand", "AbortCommand"],
  Starting: ["Starting_State_Complete", "StopCommand", "AbortCommand"],
  Execute: ["Execute_State_Complete", "HoldCommand", "SuspendCommand", "StopCommand", "AbortCommand"],
  Completing: ["Completing_State_Complete", "StopCommand", "AbortCommand"],
  Complete: ["ResetCommand", "StopCommand", "AbortCommand"],
  Resetting: ["Resetting_State_Complete", "StopCommand", "AbortCommand"],
  Holding: ["Holding_State_Complete", "StopCommand", "AbortCommand"],
  Held: ["UnholdCommand", "StopCommand", "AbortCommand"],
  Unholding: ["Unholding_State_Complete", "StopCommand", "AbortCommand"],
  Suspending: ["Suspending_State_Complete", "StopCommand", "AbortCommand"],
  Suspended: ["UnsuspendCommand", "StopCommand", "AbortCommand"],
  Unsuspending: ["Unsuspending_State_Complete", "StopCommand", "AbortCommand"],
  Stopping: ["Stopping_State_Complete", "AbortCommand"],
  Stopped: ["ResetCommand", "AbortCommand"],
  Aborting: ["Aborting_State_Complete"],
  Aborted: ["ClearCommand"],
  Clearing: ["Clearing_State_Complete", "AbortCommand"],
};

// PackML-style layout: top row is the happy-path (Idle → Starting → … → Complete),
// hold/suspend branches sit below Execute, terminal states at the bottom.
export const STATE_POSITIONS: Record<string, { x: number; y: number }> = {
  Resetting: { x: 0, y: 0 },
  Idle: { x: 180, y: 0 },
  Starting: { x: 360, y: 0 },
  Execute: { x: 540, y: 0 },
  Completing: { x: 720, y: 0 },
  Complete: { x: 900, y: 0 },

  Holding: { x: 360, y: 140 },
  Held: { x: 540, y: 140 },
  Unholding: { x: 720, y: 140 },

  Suspending: { x: 360, y: 280 },
  Suspended: { x: 540, y: 280 },
  Unsuspending: { x: 720, y: 280 },

  Stopping: { x: 180, y: 420 },
  Stopped: { x: 360, y: 420 },
  Clearing: { x: 540, y: 420 },

  Aborting: { x: 180, y: 560 },
  Aborted: { x: 360, y: 560 },
};

export function transitionTarget(transition: string): string | undefined {
  return COMMAND_TARGET[transition] ?? AUTO_TARGET[transition];
}

export function transitionLabel(transition: string): string {
  if (transition in COMMAND_TARGET) return transition.replace("Command", "");
  if (transition.endsWith("_State_Complete")) return "auto";
  return transition;
}
