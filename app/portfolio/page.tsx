"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import { createWalletClient, createPublicClient, custom } from 'viem';
import { sepolia } from 'viem/chains';
import axios from 'axios';
import { IProvider } from "@web3auth/base";

// Composants factorisés
import BalanceCard from "@/components/portfolio-page/BalanceCard";
import FundAccountModal from "@/components/portfolio-page/FundAccountModal";
import PositionsList from "@/components/portfolio-page/PositionsList"
import RampButtons from "@/components/portfolio-page/RampButtons";
import NavBar from "@/components/navigation/NavBar";

// Services
import { handleApproveAction, handleDepositAction } from "@/services/viemEscrow";
import { interactionAMM } from "@/services/viemMarkets";
import handleSwap from "@/services/handleSwap";
import { portefolioMarkets } from "@/data/mockMarkets";

// NextUI components
import { Divider, Tabs, Tab } from "@nextui-org/react";

// Icons
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

export default function PortfolioPage() {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { provider } = useWeb3Auth();

    const [selectedTab, setSelectedTab] = useState('current');
    const [isApproved, setIsApproved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // État pour l'adresse et la balance
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);

    /**
     * Fonction pour récupérer l'adresse de l'utilisateur
     */
    const fetchUserAddress = async () => {
        if (!provider) return;

        const walletClient = createWalletClient({
            chain: sepolia,
            transport: custom(provider),
        });

        try {
            const addresses = await walletClient.getAddresses();
            if (addresses.length > 0) {
                setUserAddress(addresses[0]); // Prend la première adresse
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'adresse :", error);
        }
    };

    /**
     * Fonction pour appeler le backend et récupérer la balance USDC
     */
    const fetchUserBalance = async (address: string) => {
        try {
            const response = await axios.get(`/api/getUsdcBalance?address=${address}`);
            if (response.status === 200) {
                setBalance(response.data.balance); // Balance en string
            } else {
                console.error("Erreur lors de la récupération de la balance :", response.data);
            }
        } catch (error) {
            console.error("Erreur lors de l'appel API getUsdcBalance :", error);
        }
    };

    /**
     * useEffect pour récupérer l'adresse et la balance au chargement
     */
    useEffect(() => {
        const fetchData = async () => {
            if (!provider) return;

            await fetchUserAddress(); // Récupère l'adresse
        };
        fetchData();
    }, [provider]);

    /**
     * useEffect pour mettre à jour la balance après récupération de l'adresse
     */
    useEffect(() => {
        if (userAddress) {
            fetchUserBalance(userAddress); // Appelle l'API pour la balance
        }
    }, [userAddress]);

    /**
     * Gère le clic sur une position => redirection vers la page de la market
     */
    const handlePositionClick = (position: any) => {
        localStorage.setItem('previousPage', '/portfolio');
        router.push(`/markets/${position.title.toLowerCase().replace(/\s+/g, '-')}`);
    };

    /**
     * Approve + Deposit
     */
    const handleDeposit = async () => {
        if (!provider) {
            console.error('Error: Provider is not initialized.');
            return;
        }

        const publicClient = createPublicClient({
            chain: sepolia,
            transport: custom(provider),
        });

        const walletClient = createWalletClient({
            chain: sepolia,
            transport: custom(provider),
        });

        try {
            setIsLoading(true);

            // 1. Approbation
            const approvalResponse = await handleApproveAction(provider, publicClient, walletClient);
            console.log('Approval successful:', approvalResponse);

            // 2. Dépôt
            const depositResponse = await handleDepositAction(provider, publicClient, walletClient);
            console.log('Deposit successful:', depositResponse);

            setIsApproved(true);
        } catch (error) {
            console.error('Deposit action failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Claim sur une position
     */
    const handleClaim = async (provider: IProvider) => {
        if (!provider) {
            console.error('Error: Provider is not initialized.');
            return;
        }
        try {
            const marketId = 1;
            const outcome = 1;
            const amountUsdc = 1;
            const recipient = "0x33e6A216C8041fd7167bE7cBd756986e6fdd4B7C";

            const { ring, signature, message } = await interactionAMM(
                marketId, // Market ID
                outcome,  // Vote ID
                amountUsdc,// amountUSDC
                1         // claimed
            );

            console.log('InteractionAMM result:', { ring, signature, message });

            // Appel API pour récupérer les gains
            const response = await axios.post('/api/redeem', {
                marketId,
                outcome,
                signature: signature.toBase64(),
                recipient,
            });

            if (response.status === 200) {
                const { message, transactionHash, amountRedeemed } = response.data;
                alert(`Success! Transaction hash: ${transactionHash}, Amount redeemed: ${amountRedeemed}`);
            } else {
                alert(`Error: ${response.data.error}`);
            }
        } catch (error) {
            console.error("Error claiming position:", error);
            alert('Failed to claim position. Please try again.');
        }
    };

    /**
     * Swap + Approve + Deposit
     */
    async function handleDepositInescrow() {
        if (!provider) {
            console.error('Error: Provider is not initialized.');
            return;
        }

        const publicClient = createPublicClient({
            chain: sepolia,
            transport: custom(provider),
        });

        const walletClient = createWalletClient({
            chain: sepolia,
            transport: custom(provider),
        });

        setIsLoading(true);

        try {
            // 1. Swap
            await handleSwap(provider, publicClient, walletClient);

            // 2. Approve
            await handleApproveAction(provider, publicClient, walletClient);
            console.log('Approval successful');

            // 3. Deposit
            await handleDepositAction(provider, publicClient, walletClient);
            console.log('Deposit successful');
        } catch (error) {
            console.error('Action failed:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 pb-24 min-h-screen overflow-y-auto">
            {/* Header fixe */}
            <div className="sticky top-0 bg-background/80 backdrop-blur-lg pt-6 pb-4 z-10">
                <h1 className="text-3xl font-bold text-center mb-8">Portfolio</h1>

                {/* Balance Card */}
                <BalanceCard address={userAddress} balance={balance} />

                {/* Boutons Onramp / Offramp */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <RampButtons
                        onPressOnRamp={onOpen}
                        offRampHandler={() => console.log('Offramp clicked')}
                        isLoading={isLoading}
                    />
                </div>

                <FundAccountModal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    handleDeposit={handleDeposit}
                    handleDepositInescrow={handleDepositInescrow}
                />

                <Divider className="my-6" />

                {/* Positions Header */}
                <h2 className="text-xl font-semibold">My Positions</h2>
            </div>

            {/* Contenu scrollable */}
            <div>
                <Tabs
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(key.toString())}
                    className="mb-2"
                >
                    <Tab key="current" title="Current">
                        <PositionsList
                            positions={portefolioMarkets.currentPositions}
                            isCurrent
                            onPositionClick={handlePositionClick}
                            onClaim={handleClaim}
                            provider={provider}
                        />
                    </Tab>
                    <Tab key="past" title="Past">
                        <PositionsList
                            positions={portefolioMarkets.pastPositions}
                            isCurrent={false}
                            onPositionClick={handlePositionClick}
                            onClaim={handleClaim}
                            provider={provider}
                        />
                    </Tab>
                </Tabs>
            </div>

            {/* Pour laisser de la place en bas (mobile) */}
            <div className="h-16" />
            <NavBar />
        </div>
    );
}