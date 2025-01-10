"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Download, ArrowRightLeft, CreditCard } from 'lucide-react';

interface FundAccountModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  handleDeposit: () => Promise<void>;
  handleDepositInescrow: () => Promise<void>;
}

export default function FundAccountModal({
  isOpen,
  onOpenChange,
  handleDeposit,
  handleDepositInescrow
}: FundAccountModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Fund your account
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 gap-4 h-[210px]">
                <Button
                  color="primary"
                  className="w-full bg-black"
                  size="lg"
                  onClick={handleDeposit}
                >
                  <Download />
                  <span className="ml-2">Deposit</span>
                </Button>
                <Button
                  color="primary"
                  variant="bordered"
                  className="w-full border-black text-black"
                  size="lg"
                  onClick={handleDepositInescrow}
                >
                  <ArrowRightLeft />
                  <span className="ml-2">Swap</span>
                </Button>
                <Button
                  color="primary"
                  className="w-full bg-black"
                  size="lg"
                >
                  <CreditCard />
                  <span className="ml-2">Buy</span>
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}