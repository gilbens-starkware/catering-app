import { Download, Search, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  getCurrentDate,
  getMonthOptions,
  getTimestampForFirstDayOfMonth,
  getTimestampForLastDayOfMonth,
} from '../../utils/date';
import { Input } from '../ui/input';
import { useEffect, useMemo, useState } from 'react';
import { truncateAddress } from '../../utils/string';
import { exportJSONToCSV } from '../../utils/csv';
import { ReportEnhancementData, ReportWallet } from '../../types/report';
import { useContract } from '@starknet-react/core';
import { ABI, CONTRACT_ADDRESS } from '../../utils/consts';

const { month: currentMonth, year: currentYear } = getCurrentDate();

export const ManagementTab = () => {
  const [newUserAddress, setNewUserAddress] = useState<string>();
  const [reportWallets, setReportWallets] = useState<ReportWallet[]>([]);
  const [walletEnhancementData, setWalletEnhancementData] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(
    `${currentYear}-${currentMonth}`,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const monthOptions = getMonthOptions();
  const { contract } = useContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
  });

  const handleLoadUserData = () => {
    const updatedReportWallets = [...reportWallets];
    const enhancementReportData: ReportEnhancementData[] = JSON.parse(
      walletEnhancementData,
    );
    enhancementReportData.forEach(({ name, email, address }) => {
      const userData = updatedReportWallets.find(({ user }) =>
        address.includes(user.split('').slice(2).join('')),
      )!;
      userData.email = email;
      userData.name = name;
    });

    setWalletEnhancementData('');
    setReportWallets(updatedReportWallets);
  };

  const handleGrantAccess = async () => {
    await contract.populate('add_allowed_user', [newUserAddress]);
    setNewUserAddress('');
  };

  const handleExportStats = () => {
    exportJSONToCSV(reportWallets);
  };

  useEffect(() => {
    const getReportData = async () => {
      const start = getTimestampForFirstDayOfMonth(selectedDate);
      const end = getTimestampForLastDayOfMonth(selectedDate);
      const reportData = await contract.get_participation_report_by_time(
        { seconds: Math.floor(start / 1000) },
        { seconds: Math.floor(end / 1000) },
      );

      setReportWallets(
        reportData.map(
          ({
            user,
            n_participations,
          }: {
            user: BigInt;
            n_participations: BigInt;
          }) => ({
            user: '0x' + user.toString(16),
            n_participations: Number(n_participations),
          }),
        ),
      );
    };

    getReportData();
  }, [selectedDate]);

  const filteredReportWallets = useMemo(() => {
    return reportWallets.filter(
      ({ user, name }) =>
        user.includes(searchTerm) || name?.includes(searchTerm),
    );
  }, [searchTerm, reportWallets]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold">Eligible Wallets</h2>
        <div className="flex items-center space-x-4">
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {new Date(option).toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button disabled={!reportWallets?.length} onClick={handleExportStats}>
            <Download className="mr-2 h-4 w-4" />
            Export Stats
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search user by address"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="h-[300px] overflow-y-auto space-y-4">
          {filteredReportWallets.map(({ user, n_participations, name }) => (
            <div
              key={user}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <span className="font-semibold">{`${truncateAddress(user)} (${name ?? 'Unknown'})`}</span>
              <Badge variant="secondary">Meals: {n_participations}</Badge>
            </div>
          ))}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Allow User Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter user wallet address"
              value={newUserAddress}
              onChange={e => setNewUserAddress(e.target.value)}
            />
            <Button onClick={handleGrantAccess}>
              <UserPlus className="mr-2 h-4 w-4" />
              Grant Access
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Enhance Report Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder='[{"name": "Satoshi", "address": "0x1234...5678", "email": "satoshi@nakamoto"} ... ]'
            value={walletEnhancementData}
            onChange={e => setWalletEnhancementData(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleLoadUserData}>Enhance</Button>
        </CardFooter>
      </Card>
    </>
  );
};
