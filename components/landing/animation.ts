export const easeOut = [0.22, 1, 0.36, 1] as const;

export const reveal = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const revealTransition = {
  duration: 0.9,
  ease: easeOut,
};
