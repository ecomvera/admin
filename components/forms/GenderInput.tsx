"use client";

import type React from "react";
import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem, FormLabel } from "../ui/form";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { X, Plus, Users } from "lucide-react";
import { defaultGenders } from "@/constants";

const GenderInput = ({
  genders,
  setGenders,
}: {
  genders: string[];
  setGenders: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const genderOptions = useMemo(() => {
    return defaultGenders.filter((item) => {
      if ((genders.includes("Male") && item === "Female") || (genders.includes("Female") && item === "Male")) {
        return false;
      }
      return !genders.includes(item);
    });
  }, [genders]);

  return (
    <FormItem className="flex w-full flex-col space-y-3">
      <FormLabel className="text-base font-medium">Gender</FormLabel>

      {genders.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {genders.map((item, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
              {item}
              <button
                type="button"
                onClick={() => setGenders(genders.filter((i) => i !== item))}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {genders.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-4">
            <div className="text-center">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No genders selected</p>
            </div>
          </CardContent>
        </Card>
      )}

      {genderOptions.length > 0 && (
        <Select onValueChange={(value) => setGenders([...genders, value])}>
          <SelectTrigger className="border-dashed">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <SelectValue placeholder="Add gender" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {genderOptions.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormItem>
  );
};

export default GenderInput;
