import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Dispatch, SetStateAction } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

interface Props {
  label: string;
  keyHighlights: {
    key: string;
    value: string;
  }[];
  setKeyHighlights: Dispatch<
    SetStateAction<
      {
        key: string;
        value: string;
      }[]
    >
  >;
}

const keys = ["sleeve", "neck", "fit", "washCare", "design"];

const KeyHighlights = ({ label, keyHighlights, setKeyHighlights }: Props) => {
  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel className="text-base text-dark-3">{label}</FormLabel>

      {keyHighlights?.map((item, index) => (
        <div className="flex gap-3">
          <Input value={item.key} aria-checked className="text-base font-semibold" />
          <Input
            type="text"
            placeholder="value"
            onChange={(e) => {
              const obj = { ...keyHighlights[index], value: e.target.value };
              setKeyHighlights([...keyHighlights.slice(0, index), obj, ...keyHighlights.slice(index + 1)]);
            }}
          />
          <Button
            variant={"outline"}
            className="text-lg p-2 text-red-500 rounded-[5px] font-semibold"
            onClick={() => setKeyHighlights(keyHighlights.filter((k) => k.key !== item.key))}
          >
            X
          </Button>
        </div>
      ))}

      {keyHighlights?.length > 0 && <div className="w-full h-1 bg-gray-200"></div>}

      <Select onValueChange={(field) => setKeyHighlights([...keyHighlights, { key: field, value: "" }])} value="">
        <SelectTrigger className="text-base">
          <SelectValue placeholder={`Select the key`} />
        </SelectTrigger>
        <SelectContent>
          {keys
            .filter((key) => !keyHighlights.some((k) => k.key === key))
            .map((key) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
};

export default KeyHighlights;
