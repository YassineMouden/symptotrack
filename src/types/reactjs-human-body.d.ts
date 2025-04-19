declare module 'reactjs-human-body' {
  interface PartOptions {
    show?: boolean;
    selected?: boolean;
  }

  export type PartsInput = Record<string, PartOptions>;

  export interface BodyComponentProps {
    partsInput?: PartsInput;
    onClick?: (id: string) => void;
    onChange?: (parts: PartsInput) => void;
    bodyModel?: 'male' | 'female';
  }

  export const BodyComponent: React.FC<BodyComponentProps>;
} 