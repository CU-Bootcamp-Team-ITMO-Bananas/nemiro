import Konva from 'konva';
import { useRef, useCallback, useEffect } from 'react';
import { Group, Image as KonvaImage, Transformer } from 'react-konva';
import { StickerElement } from '@/shared/interfaces/board/tools/sticker-element.interface';
import { ImageElement } from '@/shared/interfaces/board/tools/image-element.interface';
import useImage from 'use-image';

interface ImageProps {
  element: ImageElement;
  onUpdate?: (element: ImageElement) => void;
  onDelete?: (element: StickerElement) => void;
  isSelected?: boolean;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  stageScale?: number;
}

export const Image = ({
  element,
  onUpdate,
  isSelected = false,
  onSelect,
  stageScale = 1,
}: ImageProps) => {
  const groupRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
    }
  }, [isSelected]);

  const content = element.content;
  const width = content.width ?? 200;
  const height = content.height ?? 200;
  const uri = content.uri;

  const [image] = useImage(uri);

  const handleDrag = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      if (!onUpdate) return;

      const node = e.target;
      onUpdate({
        ...element,
        content: {
          ...content,
          x: node.x(),
          y: node.y(),
        },
      });
    },
    [onUpdate, element, content]
  );

  const handleClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;

      if (onSelect) {
        onSelect(e);
      }
    },
    [onSelect]
  );

  const handleTransform = useCallback(() => {
    if (!onUpdate || !groupRef.current) return;

    const node = groupRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Calculate the new dimensions based on scale
    const newWidth = Math.max(5, width * scaleX);
    const newHeight = Math.max(5, height * scaleY);

    onUpdate({
      ...element,
      content: {
        ...content,
        x: node.x(),
        y: node.y(),
        scale: scaleX, // Assuming uniform scaling
        rotation: node.rotation(),
        width: newWidth,
        height: newHeight,
      },
    });
  }, [onUpdate, element, content, width, height]);

  return (
    <>
      <Group
        ref={groupRef}
        x={content.x}
        y={content.y}
        width={width}
        height={height}
        rotation={content.rotation || 0}
        scaleX={content.scale || 1}
        scaleY={content.scale || 1}
        onClick={handleClick}
        onDragMove={handleDrag}
        onTransform={handleTransform}
        draggable
      >
        <KonvaImage height={height} width={width} image={image} />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          keepRatio={true}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => ({
            ...newBox,
            width: Math.max(30, newBox.width),
            height: Math.max(30, newBox.height),
          })}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
          ]}
        />
      )}
    </>
  );
};
