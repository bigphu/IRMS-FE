import { useState, useEffect } from "react";

export const useScrollSpy = (sectionIds: string[]) => {
  // Default to the first item in the list
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // As a section enters our "sensor band", set it to active
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        root: null, // Uses the screen viewport
        // Creates a target area starting 20% from the top and ending 50% from the bottom
        // This ensures very tall sections remain active while scrolling through them
        rootMargin: "0px", 
        threshold: 0.8, 
      }
    );

    // Observe all elements
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
    
    // This guarantees the observer only resets if the actual strings change.
  }, [sectionIds]); 

  return activeId;
};