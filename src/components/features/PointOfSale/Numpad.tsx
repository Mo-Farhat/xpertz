import React from 'react';
import { Button } from "../../ui/button";
import { ArrowLeft } from 'lucide-react';

interface NumpadProps {
  onNumberClick: (value: string) => void;
  onDiscountClick: () => void;
  onBackspaceClick: () => void;
  onEnterClick: () => void;
  disabled?: boolean;
}

const Numpad: React.FC<NumpadProps> = ({ 
  onNumberClick, 
  onDiscountClick, 
  onBackspaceClick, 
  onEnterClick,
  disabled = false 
}) => {
  const buttons = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];

  return (
    <div className="grid grid-cols-3 gap-2">
      {buttons.map((btn) => (
        <Button
          key={btn}
          variant="outline"
          className="aspect-square text-lg font-semibold hover:bg-gray-100"
          onClick={() => onNumberClick(btn)}
          disabled={disabled}
        >
          {btn}
        </Button>
      ))}
      <Button
        variant="outline"
        className="aspect-square text-lg font-semibold hover:bg-gray-100"
        onClick={onDiscountClick}
        disabled={disabled}
      >
        %
      </Button>
      <Button
        variant="outline"
        className="aspect-square text-lg font-semibold hover:bg-gray-100"
        onClick={onBackspaceClick}
        disabled={disabled}
      >
        <ArrowLeft size={18} />
      </Button>
      <Button
        variant="outline"
        className="aspect-square text-lg font-semibold hover:bg-gray-100"
        onClick={onEnterClick}
        disabled={disabled}
      >
        Enter
      </Button>
    </div>
  );
};

export default Numpad;