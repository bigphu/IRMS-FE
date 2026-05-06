import { formatCurrency } from "../../../../utils/formatters";
import { Button, ScrollArea } from "@/components";
import { default as CountDisplay } from "../CountDisplay";
import CustomizationOption from "../CustomizationOption"; // Adjust import path as needed
import { useItemContext } from "../../context/ItemContext";

interface BaseModalProps {
  onAction: () => void;
  onClose: () => void;
  actionLabel: string;
}

const BaseModal = ({
  onAction,
  onClose,
  actionLabel,
}: BaseModalProps) => {
  const { item, opts, handleToggleOption, totalPrice } = useItemContext();

  return (
    <div className="bg-dark/80 fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-tr-card rounded-bl-card flex h-170 w-full max-w-7xl shadow-2xl">
        <div className="rounded-tr-card border-background/80 rounded-bl-card relative flex h-full w-1/3 cursor-pointer flex-col justify-between border-4 p-6 shadow-lg">
          {/* LAYER 1 */}
          <div className="bg-dark rounded-tr-card rounded-bl-card absolute inset-0 flex flex-col justify-between overflow-hidden shadow-lg">
            <img
              src={item.imageUrl}
              className="absolute bottom-0 scale-160 -rotate-10 rounded-full object-fill"
            />
          </div>

          {/* LAYER 2: The Green Div (Unclipped, z-10) */}
          <div className="pointer-events-none absolute top-5 left-0 z-10 h-full w-full">
            <div className="bg-primary rounded-bl-card rounded-tr-card absolute top-5 -left-5 flex h-12 w-70"></div>
          </div>

          {/* LAYER 3: The Text (relative layout, z-20 so it floats above the green div) */}
          <h1 className="text-surface relative z-20 mt-5 mb-1 text-4xl font-bold">
            CUSTOMIZE <br/>
            YOUR ORDER
          </h1>
        </div>

        <div className="flex h-full w-2/3 flex-col p-10">
          <div className="mb-1 flex items-end justify-between">
            <div>
              <h1 className="text-dark text-4xl font-bold">{item.name}</h1>
            </div>
            <div className="font-bold">
              <span className="text-dark text-md">Base: &ensp;</span>
              <span className="text-primary text-2xl">
                {formatCurrency(item.price)}
              </span>
            </div>
          </div>

          <div className="mb-1 max-h-24 rounded-lg p-4">
            <p className="text-dark/80 text-sm">{item.description}</p>
          </div>

          {/* <hr className="mb-3 text-primary/50" ></hr> */}

          <div>
            <h3 className="text-dark mb-4 text-lg font-bold">Customizations</h3>
          </div>

          <ScrollArea direction="horizontal" className="h-full">
            <div className="flex flex-col flex-wrap gap-4 content-start">
            {item.customizationOptions?.map((c) => (
              <CustomizationOption
                key={c.id}
                option={c}
                isSelected={opts.some((o) => o.id === c.id)}
                onToggle={handleToggleOption}
              />
            ))}
            {(!item.customizationOptions ||
              item.customizationOptions.length === 0) && (
              <p className="text-gray-400">No customization available.</p>
            )}

            </div>
          </ScrollArea>

          {/* <hr className="mb-1 text-primary/50"></hr> */}

          <div className="mb-6 flex items-center justify-between pt-4">
            <CountDisplay
              min={1}
            />

            <div className="text-right font-bold">
              <span className="text-dark text-md">Total Price: &ensp;</span>
              <span className="text-highlight text-2xl font-bold">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>


          <div className="flex items-center justify-end gap-3">
            <div className="text-right">
            </div>
            <Button variant="primary" onClick={onAction} className="px-6 py-2">
              {actionLabel.toUpperCase()}
            </Button>

            <Button variant="outline" onClick={onClose} className="px-3 py-2">
              BACK
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BaseModal;