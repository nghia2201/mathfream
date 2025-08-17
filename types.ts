export type VariableFormat = 'string' | 'number' | 'boolean' | 'list' | 'matrix' | 'dict';

export interface InputVariable {
  id: number;
  name: string;
  format: VariableFormat;
  description: string;
}

export interface Tool {
  id: number;
  name: string;
  avatar: string | null; // Base64 data URL
  description: string;
  variables: InputVariable[];
  pythonCode: string;
}
