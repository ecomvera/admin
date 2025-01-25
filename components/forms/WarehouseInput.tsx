import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IAttribute, IWarehouse } from "@/types";

interface Props {
  label: string;
  warehouses: {
    id: string;
    quantity: number;
    name: string;
  }[];
  setWarehouses: Dispatch<
    SetStateAction<
      {
        id: string;
        quantity: number;
        name: string;
      }[]
    >
  >;
  defaultWarehouses: IWarehouse[];
}

const WarehouseInput = ({ label, warehouses, setWarehouses, defaultWarehouses }: Props) => {
  const [selectedWarehouses, setSelectedWarehouses] = useState<{ id: string; quantity: number; name: string }[]>([]);

  useEffect(() => {
    setSelectedWarehouses(warehouses.map((k) => ({ id: k.id, quantity: k.quantity, name: k.name })));
  }, [warehouses]);

  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel className="text-base text-dark-3">{label}</FormLabel>

      {selectedWarehouses?.map((item, index) => (
        <div className="flex gap-2 py-[1px]" key={index}>
          <Input value={item.name} aria-checked className="text-sm font-semibold" readOnly />
          <Input
            type="number"
            className="text-sm w-16 placeholder:text-sm p-1"
            placeholder="Qnt."
            value={warehouses[index]?.quantity === 0 ? "" : warehouses[index]?.quantity}
            onChange={(e) => {
              const objIndex = warehouses.findIndex((k) => k.id === item.id);
              const obj = {
                id: item.id,
                quantity: Number(e.target.value),
                name: item.name,
              };
              setWarehouses([...warehouses.slice(0, objIndex), obj, ...warehouses.slice(objIndex + 1)]);
            }}
          />
          <Button
            type="button"
            variant={"outline"}
            className="text-lg p-2 text-red-500 rounded-[5px] font-semibold"
            onClick={() => {
              setWarehouses(warehouses.filter((k) => k.id !== item.id));
              setSelectedWarehouses(selectedWarehouses.filter((k) => k !== item));
            }}
          >
            X
          </Button>
        </div>
      ))}

      {warehouses?.length > 0 && <div className="w-full h-1 my-2"></div>}

      {defaultWarehouses.length !== selectedWarehouses.length && (
        <Select
          onValueChange={(field) => {
            const name = defaultWarehouses.find((w) => w.id === field)?.warehouseName ?? "";
            setWarehouses([...warehouses, { id: field, quantity: 0, name }]);
            setSelectedWarehouses([...selectedWarehouses, { id: field, name, quantity: 0 }]);
          }}
          value=""
        >
          <SelectTrigger className="text-base">
            <SelectValue placeholder={`Select`} />
          </SelectTrigger>
          <SelectContent>
            {defaultWarehouses
              ?.filter((dw) => !selectedWarehouses.some((w) => w.id === dw.id))
              .map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.warehouseName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}
    </FormItem>
  );
};

export default WarehouseInput;
