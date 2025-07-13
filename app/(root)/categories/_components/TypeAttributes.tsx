"use client";

import React, { useRef } from "react";
import type { IAttribute, IType } from "@/types";
import { Input } from "@/components/ui/input";
import { CheckIcon, CircleIcon, Cross1Icon, Cross2Icon, Pencil2Icon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { addAttributeValueDB, updateAttributeDB } from "@/lib/actions/attribute.action";
import { error, success } from "@/lib/utils";
import { DeleteAttribute } from "@/components/dialogs/deleteAttribute";
import { IoCheckmark } from "react-icons/io5";
import { useEnumsStore } from "@/stores/enums";
import { capitalize } from "lodash";
import { DeleteType } from "@/components/dialogs/deleteType";
import CreateAttribute from "./CreateAttribute";
import { updateProductTypeDB } from "@/lib/actions/type.action";
import { useTypes } from "@/hook/useTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Settings, Tag } from "lucide-react";

const TypeAttributes = () => {
  const { types, fetchingTypes: isLoading } = useTypes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-muted-foreground">Loading types...</span>
      </div>
    );
  }

  if (types.length === 0) {
    return (
      <div className="text-center py-8">
        <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No product types found. Add your first type above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {types?.map((type) => (
        <Item key={type?.id} type={type} />
      ))}
    </div>
  );
};

const Item = ({ type }: { type: IType }) => {
  const { updateType } = useEnumsStore();
  const [value, setValue] = React.useState<string>(type.name);
  const [edit, setEdit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.length < 3) return error("Key must be at least 3 characters long");

    setLoading(true);
    const res = await updateProductTypeDB(type.id, capitalize(value.trim()));
    setLoading(false);

    if (!res?.ok) return error(res?.error || "Something went wrong");

    updateType(type.id, capitalize(value.trim()));
    setEdit(false);
    success("Type updated successfully");
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          {edit ? (
            <form onSubmit={handleUpdateName} className="flex items-center gap-2 flex-1">
              <Input value={value} onChange={(e) => setValue(e.target.value)} className="flex-1" autoFocus />
              <div className="flex gap-1">
                {loading ? (
                  <CircleIcon className="w-5 h-5 animate-spin" />
                ) : (
                  <Button size="sm" variant="ghost" type="submit">
                    <IoCheckmark className="w-4 h-4 text-green-600" />
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setEdit(false)}>
                  <Cross2Icon className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-lg">{type.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{type.attributes?.length || 0} attributes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setEdit(true)}>
                  <Pencil2Icon className="w-4 h-4" />
                </Button>
                <CreateAttribute productTypeId={type.id} />
                <DeleteType id={type.id} />
              </div>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!type.attributes || type.attributes?.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed rounded-lg">
            <Tag className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No attributes defined</p>
            <p className="text-xs text-muted-foreground">Add attributes to organize product properties</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {type.attributes?.map((attribute) => (
              <AttributeItem key={attribute.id} attribute={attribute} productTypeId={type.id} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AttributeItem = ({ attribute, productTypeId }: { attribute: IAttribute; productTypeId: string }) => {
  const { addAttributeValue, updateAttributeKey } = useEnumsStore();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [addNew, setAddNew] = React.useState(false);
  const [value, setValue] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [key, setKey] = React.useState<string>(attribute.key);
  const [edit, setEdit] = React.useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const res = await addAttributeValueDB(attribute.id, capitalize(value.trim()));
    setLoading(false);

    if (!res?.ok) return error(res?.error || "Something went wrong");

    addAttributeValue(attribute.id, capitalize(value.trim()), productTypeId);
    success("Value added successfully");
    setValue("");
    setAddNew(false);
  };

  const handleUpdateKey = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (key.length < 3) return error("Key must be at least 3 characters long");

    setLoading(true);
    const res = await updateAttributeDB(attribute.id, key.trim());
    setLoading(false);

    if (!res?.ok) return error(res?.error || "Something went wrong");

    updateAttributeKey(attribute.id, key.trim(), productTypeId);
    success("Key updated successfully");
    setEdit(false);
  };

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
      {edit ? (
        <form onSubmit={handleUpdateKey} className="flex items-center gap-2">
          <Input value={key} onChange={(e) => setKey(e.target.value)} className="flex-1" autoFocus />
          <div className="flex gap-1">
            {loading ? (
              <CircleIcon className="w-5 h-5 animate-spin" />
            ) : (
              <Button size="sm" variant="ghost" type="submit">
                <IoCheckmark className="w-4 h-4 text-green-600" />
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => setEdit(false)}>
              <Cross2Icon className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{attribute.key}</h4>
            <Button size="sm" variant="ghost" onClick={() => setEdit(true)}>
              <Pencil2Icon className="w-4 h-4" />
            </Button>
          </div>
          <DeleteAttribute id={attribute?.id as string} type="key" productTypeId={productTypeId} />
        </div>
      )}

      <div className="space-y-2 flex gap-2">
        {attribute.value.length === 0 ? (
          <p className="text-sm text-muted-foreground">No values defined</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {attribute.value.map((value) => (
              <Badge key={value} variant="secondary" className="flex items-center gap-1">
                {value}
                <DeleteAttribute
                  id={attribute?.id as string}
                  type="value"
                  values={attribute.value.filter((v) => v !== value)}
                  productTypeId={productTypeId}
                />
              </Badge>
            ))}
          </div>
        )}

        <Button
          size="sm"
          variant="outline"
          className={`${addNew ? "hidden" : "flex"} items-center gap-1`}
          onClick={() => {
            setAddNew(true);
            setTimeout(() => inputRef?.current?.focus(), 100);
          }}
        >
          <PlusIcon className="w-4 h-4" />
          Add Value
        </Button>

        <form onSubmit={handleAdd} className={`flex gap-2 ${!addNew && "hidden"}`}>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Add attribute value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setAddNew(false);
              setValue("");
            }}
            type="button"
          >
            <Cross1Icon className="w-4 h-4" />
          </Button>
          <Button size="sm" disabled={loading || value === ""} type="submit">
            {loading ? <CircleIcon className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TypeAttributes;
