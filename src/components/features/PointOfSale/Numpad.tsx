import React from 'react';
import { Button } from "../../ui/button";

interface NumpadProps {
  onNumberClick: (value: string) => void;
  onDiscountClick: () => void;
  onBackspaceClick: () => void;
  onEnterClick: () => void;
}

const Numpad: React.FC<NumpadProps> = ({ onNumberClick, onDiscountClick, onBackspaceClick, onEnterClick }) => {
  const buttons = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];

  return (
    <div className="grid grid-cols-3 gap-2">
      {buttons.map((btn) => (
        <Button
          key={btn}
          variant="outline"
          className="aspect-square text-lg font-semibold hover:bg-gray-100"
          onClick={() => onNumberClick(btn)}
        >
          {btn}
        </Button>
      ))}
      <Button
        variant="outline"
        className="aspect-square text-lg font-semibold hover:bg-gray-100"
        onClick={onDiscountClick}
      >
        Discount
      </Button>
      <Button
        variant="outline"
        className="aspect-square text-lg font-semibold hover:bg-gray-100"
        onClick={onBackspaceClick}
      >
        ←
      </Button>
      <Button
        variant="outline"
        className="aspect-square text-lg font-semibold hover:bg-gray-100"
        onClick={onEnterClick}
      >
        Enter
      </Button>
    </div>
  );
};

export default Numpad;