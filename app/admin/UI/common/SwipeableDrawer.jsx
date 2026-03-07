"use client";

import { useEffect, useRef, useState } from "react";

export default function SwipeableDrawer({
  open,
  onClose,
  children,
  height = "55vh",
}) {
  const drawerRef = useRef(null);

  const startY = useRef(0);
  const lastY = useRef(0);
  const startTime = useRef(0);
  const dragging = useRef(false);

  const [visible, setVisible] = useState(open);

  /* mount drawer */
  useEffect(() => {
    if (open) setVisible(true);
  }, [open]);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [visible]);

  /* OPEN animation */
  useEffect(() => {
    if (open && drawerRef.current) {
      const drawer = drawerRef.current;

      drawer.style.transform = "translateY(100%)";

      requestAnimationFrame(() => {
        drawer.style.transition =
          "transform 300ms cubic-bezier(0.4,0,0.2,1)";
        drawer.style.transform = "translateY(0)";
      });
    }
  }, [open]);

  /* CLOSE animation */
  const animateClose = () => {
    const drawer = drawerRef.current;
    const drawerHeight = drawer.offsetHeight;

    drawer.style.transition =
      "transform 260ms cubic-bezier(0.4,0,0.2,1)";
    drawer.style.transform = `translateY(${drawerHeight}px)`;

    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 260);
  };

  /* TOUCH START */
  const onTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    lastY.current = startY.current;
    startTime.current = Date.now();
    dragging.current = true;

    drawerRef.current.style.transition = "none";
  };

  /* TOUCH MOVE */
  const onTouchMove = (e) => {
    if (!dragging.current) return;

    const currentY = e.touches[0].clientY;
    const delta = currentY - startY.current;

    if (delta < 0) return;

    lastY.current = currentY;

    drawerRef.current.style.transform = `translateY(${delta}px)`;
  };

  /* TOUCH END */
  const onTouchEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;

    const delta = lastY.current - startY.current;
    const time = Date.now() - startTime.current;
    const velocity = delta / time;

    const drawerHeight = drawerRef.current.offsetHeight;

    drawerRef.current.style.transition =
      "transform 260ms cubic-bezier(0.4,0,0.2,1)";

    if (delta > drawerHeight * 0.3 || velocity > 0.6) {
      animateClose();
    } else {
      drawerRef.current.style.transform = "translateY(0)";
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        onClick={animateClose}
      />

      {/* DRAWER */}
      <div
        ref={drawerRef}
        style={{ height }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] rounded-t-2xl shadow-xl touch-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* HANDLE */}
        <div className="flex justify-center py-3">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* CONTENT */}
        <div className="h-full overflow-y-auto px-4 pb-6">
          {children}
        </div>
      </div>
    </>
  );
}