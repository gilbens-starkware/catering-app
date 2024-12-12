import { useMemo, useState } from 'react';
import { AdCard } from '../AdCard/AdCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { StatsCard } from '../StatsCard/StatsCard';
import { getCurrentDate, groupAdsByMonth } from '../../utils/date';
import { useMonthlyStats } from '../../hooks/useMonthlyStats';
import { EmptyStatsCard } from '../StatsCard/EmptyStatsCard';
import { Apt } from '../../types/apt';
import { Ad } from '../../types/ad';
import { useContract } from '@starknet-react/core';
import { ADS_ABI, ADS_CONTRACT_ADDRESS } from '../../utils/ads_abi';
import { REG_ABI, REG_CONTRACT_ADDRESS } from '../../utils/registration_abi';

// const { month: currentMonth, year: currentYear } = getCurrentDate();

export const PublishNewAdTab = ({
  setActiveTab,
}: {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { contract: ads_contract } = useContract({
    abi: ADS_ABI,
    address: ADS_CONTRACT_ADDRESS,
  });

  const { contract: reg_contract } = useContract({
    abi: REG_ABI,
    address: REG_CONTRACT_ADDRESS,
  });

  const [assetId, setAssetId] = useState("");
  const [price, setPrice] = useState("");   
  const [description, setDescription] = useState("");   
  const [pictureUrl, setPictureUrl] = useState("");
  const [phone, setPhone] = useState("");   
  const [saleOrLease, setSaleOrLease] = useState("for_sale");   
  const [entry_date, setEntryDate] = useState("");   

  const createNewAd = async () => {
    let apt : Apt = {id: assetId, info : await reg_contract.get_info(assetId)};
    // let ad_info : Ad = { info: {
    //   apt: apt_info,
    //   is_sale: (saleOrLease === "for_sale"),
    //   price: Number(price),
    //   description: description,
    //   phone: phone,
    //   publication_date: { second: Math.floor(Date.now() / 1000) },
    //   entry_date: {second: Math.floor(Number(entry_date) / 1000)},
    //   picture_url: pictureUrl,
    // } }
    // ads_contract.publish_ad(ad_info);
    await ads_contract.populate('publish_ad', [
      assetId,
      apt.info.owner,
      apt.info.address.town,
      apt.info.address.street,
      apt.info.address.number,
      apt.info.area,
      apt.info.floor,
      saleOrLease === "for_sale", // is_sale
      Number(price),
      Math.floor(Date.now() / 1000), // publication_date
      Math.floor(Number(entry_date) / 1000), // entry_date
      0,
      0,
      0,
      0,
      0,
      0,
    ])
    
  };


  
  return (
    <>
        <h2 className="text-2xl font-bold">Publish a new ad!</h2>
        Asset i.d. in the registry: &nbsp;  <input
            type="text"
            id="assetIdInput"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            placeholder="0xdeadbeef"
            style={{ width: "800px", padding: "4px"}}
        /><br />
        Asking price for the asset: &nbsp;  <input
            type="text"
            id="priceInput"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="12.34"
        /><br />
        <div>
        Asset description: <br />  <textarea
            id="descriptionInput"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            cols={100}
            style={{ padding: "4px"}}
            placeholder="One closet apartment in the middle of Tel Aviv"
        /><br />
        Picture url: &nbsp;  <input
            type="text"
            id="pictureUrl"
            value={pictureUrl}
            onChange={(e) => setPictureUrl(e.target.value)}
            placeholder="https://static.wikia.nocookie.net/dqw4w9wgxcq/images/6/61/Rickrolling.gif/revision/latest?cb=20220719030942"
            style={{ width: "800px", padding: "4px"}}
        />
        </div>
        Contact phone number: &nbsp; <input
            type="text"
            id="phoneInput"
            value={phone}
            onChange={(e) =>  setPhone(e.target.value)}
            placeholder="054-5454545"
            style={{ width: "140px", padding: "4px"}}
        /><br />
        <div>
        Is the asset for sale or for lease?
        <br />
        &nbsp;&nbsp; <input
          type="radio"
          id="for_sale"
          name="sale_or_lease"
          value="for_sale"
          checked={saleOrLease === "for_sale"}
          onChange={(e) => setSaleOrLease(e.target.value)}
        /> &nbsp; For sale <br />
        &nbsp;&nbsp; <input
          type="radio"
          id="for_lease"
          name="sale_or_lease"
          value="for_lease"
          checked={saleOrLease === "for_lease"}
          onChange={(e) => setSaleOrLease(e.target.value)}
        /> &nbsp; For lease
        </div>
        Delivery date for the asset: &nbsp; <input
            type="date"
            id="entryDateInput"
            value={entry_date}
            onChange={(e) => setEntryDate(e.target.value)}
        /><br />

        <button
           onClick={async () => {await createNewAd();}}
           // style = ({width: "150px"})
        >Publish ad!</button>


        
    </>
  );
};
