// Minimal mock of the `framer` package for local Vite preview.
// The real Framer APIs (addPropertyControls, ControlType) only run inside
// the Framer canvas; outside of it we just need them to be no-ops.

export const addPropertyControls = () => {}

export const ControlType = {
    String: "string",
    Color: "color",
    Image: "image",
    Array: "array",
    Object: "object",
    Number: "number",
    Boolean: "boolean",
    Enum: "enum",
} as const
