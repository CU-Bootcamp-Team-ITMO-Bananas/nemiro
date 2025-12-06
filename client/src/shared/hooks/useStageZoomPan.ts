import { useState, useRef, useCallback } from 'react';

export const useStageZoomPan = () => {
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1);
  const stageRef = useRef<any>(null);
  const lastCenter = useRef<{ x: number; y: number } | null>(null);
  const lastDist = useRef(0);

  // Adjust these values to control sensitivity
  const ZOOM_SENSITIVITY = 0.05; // Lower = less sensitive (0.05 = 5% change per wheel click)
  const PAN_SENSITIVITY = 0.5; // Lower = less sensitive (0.5 = 50% of normal speed)
  const PINCH_SENSITIVITY = 0.01; // Lower = less sensitive pinch

  const handleWheel = useCallback(
    (e: any) => {
      e.evt.preventDefault();

      const stage = stageRef.current;
      if (!stage) return;

      const pointer = stage.getPointerPosition();

      if (e.evt.ctrlKey || e.evt.metaKey) {
        // Zoom with CTRL/CMD + Wheel - Less sensitive
        const scaleBy = 1 + ZOOM_SENSITIVITY;
        const oldScale = stage.scaleX();
        const newScale =
          e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        // Limit zoom range
        const clampedScale = Math.max(0.1, Math.min(5, newScale));

        setStageScale(clampedScale);

        // Adjust position to zoom towards mouse pointer
        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        const newPos = {
          x: pointer.x - mousePointTo.x * clampedScale,
          y: pointer.y - mousePointTo.y * clampedScale,
        };

        setStagePos(newPos);
      } else {
        // Pan with wheel - Less sensitive
        const newPos = {
          x: stage.x() - e.evt.deltaX * PAN_SENSITIVITY,
          y: stage.y() - e.evt.deltaY * PAN_SENSITIVITY,
        };
        setStagePos(newPos);
      }
    },
    [ZOOM_SENSITIVITY, PAN_SENSITIVITY]
  );

  const handleTouchStart = useCallback((e: any) => {
    e.evt.preventDefault();
    const touches = e.evt.touches;

    if (touches.length === 2) {
      const touch1 = touches[0];
      const touch2 = touches[1];

      lastDist.current = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      lastCenter.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: any) => {
      e.evt.preventDefault();
      const touches = e.evt.touches;
      const stage = stageRef.current;

      if (!stage || touches.length !== 2 || !lastCenter.current) return;

      const touch1 = touches[0];
      const touch2 = touches[1];

      const currentDist = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const currentCenter = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };

      // Calculate zoom with sensitivity adjustment
      const distChange = currentDist - lastDist.current;
      const zoomFactor =
        1 + (distChange * PINCH_SENSITIVITY) / lastDist.current;
      const newScale = stageScale * zoomFactor;

      const clampedScale = Math.max(0.1, Math.min(5, newScale));

      // Adjust position based on pinch center
      const stageX = stage.x();
      const stageY = stage.y();
      const scaleChange = clampedScale / stageScale;
      const dx = (currentCenter.x - lastCenter.current.x) * PAN_SENSITIVITY;
      const dy = (currentCenter.y - lastCenter.current.y) * PAN_SENSITIVITY;

      const newPos = {
        x: stageX + dx - (currentCenter.x - stageX) * (scaleChange - 1),
        y: stageY + dy - (currentCenter.y - stageY) * (scaleChange - 1),
      };

      setStageScale(clampedScale);
      setStagePos(newPos);

      lastDist.current = currentDist;
      lastCenter.current = currentCenter;
    },
    [stageScale, PINCH_SENSITIVITY, PAN_SENSITIVITY]
  );

  const handleTouchEnd = useCallback(() => {
    lastDist.current = 0;
    lastCenter.current = null;
  }, []);

  return {
    stageRef,
    stagePos,
    stageScale,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
