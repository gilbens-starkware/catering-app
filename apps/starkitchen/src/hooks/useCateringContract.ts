import CateringAbi from '../providers/catering-abi.json';
import { useContract } from "@catering-app/starknet-contract-connect";

const CONTRACT_ADDRESS = '0x049c75609bb077a9427bc26a9935472ec75e5508ed216ef7f7ad2693397deebc';

export const useCateringContract = () => {
  return useContract({
    abi: CateringAbi,
    address: CONTRACT_ADDRESS,
  })
}
