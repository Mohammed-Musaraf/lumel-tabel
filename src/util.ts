import { Row } from "@tanstack/react-table";
import { InventoryData } from "./types";

export const data: InventoryData[] = [
  {
    id: "electronics",
    label: "Electronics",
    value: 1500, //this value needs to be calculated from the children values (800+700)
    variance: 0,
    children: [
      {
        id: "phones",
        label: "Phones",
        value: 800,
        variance: 0,
      },
      {
        id: "laptops",
        label: "Laptops",
        value: 700,
        variance: 0,
      },
    ],
  },
  {
    id: "furniture",
    label: "Furniture",
    value: 1000, //this need to be calculated from the children values (300+700)
    variance: 0,
    children: [
      {
        id: "tables",
        label: "Tables",
        value: 300,
        variance: 0,
      },
      {
        id: "chairs",
        label: "Chairs",
        value: 700,
        variance: 0,
      },
    ],
  },
];

export const increaseAllocationPercentage = (
  existingData: InventoryData[],
  row: Row<InventoryData>,
  inputValue: number
): InventoryData[] => {
  return existingData.map((p) => {
    if (p.id === row.original.id) {
      return {
        ...p,
        oldValue: p?.oldValue ?? row.original.value,
        value: Number((p.value + p.value / inputValue).toFixed(2)),
        variance: p.variance + inputValue,
      };
    }
    if (p.children) {
      let pChange = p;
      let isChanged = false;
      const modifiedChildren = p.children.map((c) => {
        if (c.id === row.original.id) {
          isChanged = true;
          return {
            ...c,
            oldValue: p?.oldValue ?? row.original.value,
            value: Number((c.value + c.value / inputValue).toFixed(2)),
            variance: c.variance + inputValue,
          };
        }
        return c;
      });
      if (isChanged) {
        let childSum = 0;
        modifiedChildren.forEach((a) => {
          childSum = childSum + a.value;
        });
        const oldValue = p.oldValue ?? p.value;
        pChange = {
          ...p,
          value: childSum,
          oldValue: p?.oldValue ?? p.value,
          variance: Number(
            (((childSum - oldValue) / oldValue) * 100).toFixed(2)
          ),
        };
      }
      return { ...pChange, children: modifiedChildren };
    }
    return p;
  });
};

export const setAllocationValue = (
  existingData: InventoryData[],
  row: Row<InventoryData>,
  inputValue: number
): InventoryData[] => {
  return existingData.map((p) => {
    if (p.id === row.original.id) {
      return {
        ...p,
        oldValue: p?.oldValue ?? row.original.value,
        value: inputValue,
        variance: Number((((inputValue - p.value) / p.value) * 100).toFixed(2)),
      };
    }
    if (p.children) {
      let pChange = p;
      let isChanged = false;
      const modifiedChildren = p.children.map((c) => {
        if (c.id === row.original.id) {
          isChanged = true;
          return {
            ...c,
            oldValue: p?.oldValue ?? row.original.value,
            value: inputValue,
            variance: Number(
              (((inputValue - c.value) / c.value) * 100).toFixed(2)
            ),
          };
        }
        return c;
      });
      if (isChanged) {
        let childSum = 0;
        modifiedChildren.forEach((a) => {
          childSum = childSum + a.value;
        });
        const oldValue = p.oldValue ?? p.value;
        pChange = {
          ...p,
          value: childSum,
          oldValue: p?.oldValue ?? p.value,
          variance: Number(
            (((childSum - oldValue) / oldValue) * 100).toFixed(2)
          ),
        };
      }
      return { ...pChange, children: modifiedChildren };
    }
    return p;
  });
};
