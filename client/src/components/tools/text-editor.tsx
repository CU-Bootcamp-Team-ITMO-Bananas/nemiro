import { Html } from 'react-konva-utils';
import { TextArea } from './text-area';
import Konva from 'konva';

interface TextEditorProps {
  textNode: Konva.Text;
  onClose: () => void;
  onChange: (text: string) => void;
  stageScale: number;
}

export const TextEditor = (props: TextEditorProps) => {
  return (
    <Html>
      <TextArea {...props} />
    </Html>
  );
};
