import { PlusCircleIcon, MinusCircleIcon } from 'lucide-react';
import { Button, InputBox } from '@/components';
import { useItemContext } from '../context/ItemContext';

export interface CountDisplayProps {
  min?: number; // Optional minimum value, default is 1
}

const CountDisplay = ({ min=1 }: CountDisplayProps) => {
  const { quantity, setQuantity } = useItemContext();

  return (
    <div className="flex items-center gap-4">
      <Button variant="full-primary" onClick={() => setQuantity(Math.max(min, quantity - 1))} disabled={quantity <= min} className="px-2 py-1">
        <MinusCircleIcon size="1rem"/>
      </Button>

      <InputBox
        content={quantity.toString()}
        onChange={(value) => {
          const numValue = parseInt(value, 10);
          if (!isNaN(numValue) && numValue >= min) {
            setQuantity(numValue);
          }
        }}
        type="positive-integer"
        min={min}
        className="px-2 py-1 w-32"
      />

      <Button variant="full-primary" onClick={() => setQuantity(quantity + 1)} disabled={quantity >= Infinity} className="px-2 py-1">
        <PlusCircleIcon size="1rem"/>
      </Button>
    </div>
  );
}

export default CountDisplay;