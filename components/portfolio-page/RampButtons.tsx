"use client";

import { Button } from "@nextui-org/react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

interface RampButtonsProps {
  onPressOnRamp: () => void;
  offRampHandler: () => void;
  isLoading: boolean;
}

export default function RampButtons({
  onPressOnRamp,
  offRampHandler,
  isLoading
}: RampButtonsProps) {
  return (
    <>
      <Button
        startContent={<ArrowDownToLine size={20} />}
        color="primary"
        variant="bordered"
        className="h-12"
        onPress={onPressOnRamp}
        isDisabled={isLoading}
      >
        Onramp
      </Button>

      <Button
        startContent={<ArrowUpFromLine size={20} />}
        color="primary"
        variant="bordered"
        className="h-12"
        onPress={offRampHandler}
        isDisabled={isLoading}
      >
        Offramp
      </Button>
    </>
  );
}