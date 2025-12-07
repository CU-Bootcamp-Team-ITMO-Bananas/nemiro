import Konva from 'konva';
import { useEffect, useRef } from 'react';

interface TextAreaProps {
  textNode: Konva.Text;
  onClose: () => void;
  onChange: (text: string) => void;
  stageScale: number;
}

export const TextArea = ({ textNode, onChange, onClose }: TextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;

    const stagePositon = textNode.getStage()?.getPosition();
    const textPosition = textNode.getAbsolutePosition();
    const areaPosition = {
      x: textPosition.x - stagePositon!.x,
      y: textPosition.y - stagePositon!.y,
    };

    // Match styles with the text node
    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${textNode.width() - textNode.padding() * 2}px`;
    textarea.style.height = `${
      textNode.height() - textNode.padding() * 2 + 5
    }px`;
    textarea.style.fontSize = `${textNode.fontSize()}px`;
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align();
    const rotation = textNode.rotation();
    let transform = '';
    if (rotation) {
      transform += `rotateZ(${rotation}deg)`;
    }
    textarea.style.transform = transform;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 3}px`;
    textarea.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      onChange(textarea.value);
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleInput = () => {
      const scale = textNode.getAbsoluteScale().x;
      textarea.style.width = `${textNode.width() * scale}px`;
      textarea.style.height = 'auto';
      textarea.style.height = `${
        textarea.scrollHeight + textNode.fontSize()
      }px`;
    };

    textarea.addEventListener('keydown', handleKeyDown);
    textarea.addEventListener('input', handleInput);

    return () => {
      textarea.removeEventListener('keydown', handleKeyDown);
      textarea.removeEventListener('input', handleInput);
    };
  }, [onChange, onClose, textNode]);

  return (
    <textarea
      ref={textareaRef}
      style={{
        minHeight: '1em',
        position: 'absolute',
      }}
    />
  );
};
