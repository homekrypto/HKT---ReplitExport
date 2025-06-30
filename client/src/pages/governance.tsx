import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Vote, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  ExternalLink
} from 'lucide-react';

interface Proposal {
  id: number;
  title: string;
  description: string;
  type: 'PropertyAcquisition' | 'PropertySale' | 'FeeChange' | 'PolicyUpdate' | 'TreasuryAction';
  status: 'Active' | 'Passed' | 'Failed' | 'Pending' | 'Executed';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  totalVotes: number;
  quorumRequired: number;
  timeRemaining: string;
  proposer: string;
  requestedAmount?: number;
  executionDate?: string;
}

interface DAOStats {
  totalHolders: number;
  totalVotingPower: string;
  treasuryBalance: string;
  activeProposals: number;
  passedProposals: number;
  participationRate: number;
}

export default function GovernancePage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [daoStats, setDAOStats] = useState<DAOStats | null>(null);
  const [userVotingPower, setUserVotingPower] = useState<string>("0");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isConnected, setIsConnected] = useState(false);

  // Mock data for demonstration - replace with real blockchain data
  useEffect(() => {
    // Simulate loading DAO data
    setDAOStats({
      totalHolders: 1247,
      totalVotingPower: "45,890,234",
      treasuryBalance: "2,340,000",
      activeProposals: 3,
      passedProposals: 12,
      participationRate: 67.8
    });

    setProposals([
      {
        id: 1,
        title: "Acquire Miami Beach Condo - Prime Location",
        description: "Proposal to acquire a luxury 2-bedroom condo in Miami Beach for $450,000. Expected 14% annual ROI through short-term rentals.",
        type: "PropertyAcquisition",
        status: "Active",
        votesFor: 234567,
        votesAgainst: 45890,
        votesAbstain: 12340,
        totalVotes: 292797,
        quorumRequired: 15,
        timeRemaining: "4 days",
        proposer: "0x1234...5678",
        requestedAmount: 450000
      },
      {
        id: 2,
        title: "Reduce Platform Fee from 10% to 8%",
        description: "Community proposal to reduce the platform management fee to increase investor returns and competitiveness.",
        type: "FeeChange",
        status: "Active",
        votesFor: 189234,
        votesAgainst: 87654,
        votesAbstain: 23456,
        totalVotes: 300344,
        quorumRequired: 10,
        timeRemaining: "2 days",
        proposer: "0xabcd...efgh"
      },
      {
        id: 3,
        title: "Sell Underperforming Punta Cana Property",
        description: "Proposal to sell the Punta Cana villa due to declining rental yields and redirect funds to higher-performing markets.",
        type: "PropertySale",
        status: "Passed",
        votesFor: 345678,
        votesAgainst: 123456,
        votesAbstain: 34567,
        totalVotes: 503701,
        quorumRequired: 20,
        timeRemaining: "Ended",
        proposer: "0x9876...5432",
        executionDate: "2025-07-15"
      }
    ]);

    setUserVotingPower("12,450");
    setIsConnected(true);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default" className="bg-blue-500">Active</Badge>;
      case 'Passed':
        return <Badge variant="default" className="bg-green-500">Passed</Badge>;
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'Executed':
        return <Badge variant="default" className="bg-purple-500">Executed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PropertyAcquisition':
        return <Plus className="h-4 w-4" />;
      case 'PropertySale':
        return <TrendingUp className="h-4 w-4" />;
      case 'FeeChange':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Vote className="h-4 w-4" />;
    }
  };

  const calculateVotePercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  const isQuorumMet = (proposal: Proposal) => {
    const quorumThreshold = (parseFloat(daoStats?.totalVotingPower.replace(/,/g, '') || "0") * proposal.quorumRequired) / 100;
    return proposal.totalVotes >= quorumThreshold;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            HKT Governance DAO
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Participate in platform decisions and shape the future of decentralized real estate investment
          </p>
        </div>

        {!isConnected && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect your wallet to view your voting power and participate in governance.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="voting">My Voting</TabsTrigger>
            <TabsTrigger value="create">Create Proposal</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {daoStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total HKT Holders</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{daoStats.totalHolders.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Eligible voting members
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Voting Power</CardTitle>
                    <Vote className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{daoStats.totalVotingPower} HKT</div>
                    <p className="text-xs text-muted-foreground">
                      Combined voting weight
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Treasury Balance</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${daoStats.treasuryBalance}</div>
                    <p className="text-xs text-muted-foreground">
                      Available for proposals
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Participation Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{daoStats.participationRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      Average voting participation
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {isConnected && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Voting Power</CardTitle>
                  <CardDescription>
                    Your voting weight is based on your HKT token holdings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>HKT Balance:</span>
                      <span className="font-semibold">{userVotingPower} HKT</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Voting Weight:</span>
                      <span className="font-semibold">
                        {daoStats ? ((parseFloat(userVotingPower.replace(/,/g, '')) / parseFloat(daoStats.totalVotingPower.replace(/,/g, ''))) * 100).toFixed(3) : 0}%
                      </span>
                    </div>
                    <Button className="w-full">
                      <Vote className="h-4 w-4 mr-2" />
                      View My Proposals
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Active Proposals</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Proposal
              </Button>
            </div>

            <div className="space-y-6">
              {proposals.map((proposal) => (
                <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(proposal.type)}
                          <CardTitle className="text-lg">{proposal.title}</CardTitle>
                          {getStatusBadge(proposal.status)}
                        </div>
                        <CardDescription className="text-sm">
                          {proposal.description}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {proposal.status === 'Active' && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {proposal.timeRemaining} left
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Voting Results */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>For ({calculateVotePercentage(proposal.votesFor, proposal.totalVotes)}%)</span>
                        <span>{proposal.votesFor.toLocaleString()} votes</span>
                      </div>
                      <Progress value={calculateVotePercentage(proposal.votesFor, proposal.totalVotes)} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Against ({calculateVotePercentage(proposal.votesAgainst, proposal.totalVotes)}%)</span>
                        <span>{proposal.votesAgainst.toLocaleString()} votes</span>
                      </div>
                      <Progress value={calculateVotePercentage(proposal.votesAgainst, proposal.totalVotes)} className="h-2 bg-red-100" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Abstain ({calculateVotePercentage(proposal.votesAbstain, proposal.totalVotes)}%)</span>
                        <span>{proposal.votesAbstain.toLocaleString()} votes</span>
                      </div>
                      <Progress value={calculateVotePercentage(proposal.votesAbstain, proposal.totalVotes)} className="h-2 bg-gray-100" />
                    </div>

                    {/* Quorum Check */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        {isQuorumMet(proposal) ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">
                          Quorum {isQuorumMet(proposal) ? 'Met' : 'Not Met'} ({proposal.quorumRequired}% required)
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {proposal.totalVotes.toLocaleString()} total votes
                      </span>
                    </div>

                    {/* Action Buttons */}
                    {proposal.status === 'Active' && isConnected && (
                      <div className="flex gap-2">
                        <Button variant="default" size="sm" className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Vote For
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <XCircle className="h-4 w-4 mr-1" />
                          Vote Against
                        </Button>
                        <Button variant="secondary" size="sm" className="flex-1">
                          Abstain
                        </Button>
                      </div>
                    )}

                    {proposal.requestedAmount && (
                      <div className="text-sm text-muted-foreground">
                        Requested Amount: ${proposal.requestedAmount.toLocaleString()}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Proposed by: {proposal.proposer}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Voting Tab */}
          <TabsContent value="voting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Voting History</CardTitle>
                <CardDescription>
                  Track your participation in DAO governance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isConnected ? (
                  <div className="text-center py-8">
                    <Vote className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Your voting history will appear here once you participate in proposals.
                    </p>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Connect your wallet to view your voting history.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Proposal Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Proposal</CardTitle>
                <CardDescription>
                  Submit a proposal for the DAO community to vote on
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isConnected ? (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You need at least 100,000 HKT tokens to create a proposal.
                        Your current balance: {userVotingPower} HKT
                      </AlertDescription>
                    </Alert>
                    <Button disabled={parseFloat(userVotingPower.replace(/,/g, '')) < 100000}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Proposal
                    </Button>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Connect your wallet to create proposals.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}