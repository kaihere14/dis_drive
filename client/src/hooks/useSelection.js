import { useState, useCallback } from "react";

export const useSelection = (items) => {
  const [selectedItems, setSelectedItems] = useState(new Set());

  const toggleSelection = useCallback((itemId) => {
    setSelectedItems((prev) => {
      const newSelectedItems = new Set(prev);
      if (newSelectedItems.has(itemId)) {
        newSelectedItems.delete(itemId);
      } else {
        newSelectedItems.add(itemId);
      }
      return newSelectedItems;
    });
  }, []);

  const selectAll = useCallback(() => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item._id)));
    }
  }, [items, selectedItems.size]);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  return {
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    isAllSelected:
      items.length > 0 && selectedItems.size === items.length,
  };
};
