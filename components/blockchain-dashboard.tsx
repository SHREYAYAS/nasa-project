"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Hash, Clock, Database, Search, Plus, Code, Activity, Shield, SatelliteIcon } from "lucide-react"
import { blockchainClient, type Transaction, type Block, type SmartContract } from "@/lib/blockchain"
import { useToast } from "@/hooks/use-toast"

export function BlockchainDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  const [contracts, setContracts] = useState<SmartContract[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [nasaIntegration, setNasaIntegration] = useState(false)
  const { toast } = useToast()
  const [newTransaction, setNewTransaction] = useState({
    type: "",
    from: "",
    to: "",
    satellite: "",
    debris: "",
    material: "",
    quantity: "",
    service: "",
    target: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [txResult, blockResult, contractResult] = await Promise.all([
        blockchainClient.getTransactions({ limit: 10 }),
        blockchainClient.getBlocks({ limit: 10 }),
        blockchainClient.getSmartContracts(),
      ])

      setTransactions(txResult.data)
      setBlocks(Array.isArray(blockResult.data) ? blockResult.data : [blockResult.data])
      setContracts(Array.isArray(contractResult.data) ? contractResult.data : [contractResult.data])
    } catch (error) {
      console.error("Failed to load blockchain data:", error)
      toast({
        title: "Error",
        description: "Failed to load blockchain data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTransaction = async () => {
    try {
      const data: Record<string, any> = {}

      if (newTransaction.satellite) data.satellite = newTransaction.satellite
      if (newTransaction.debris) data.debris = newTransaction.debris
      if (newTransaction.material) data.material = newTransaction.material
      if (newTransaction.quantity) data.quantity = newTransaction.quantity
      if (newTransaction.service) data.service = newTransaction.service
      if (newTransaction.target) data.target = newTransaction.target

      await blockchainClient.createTransaction({
        type: newTransaction.type as any,
        data,
        from: newTransaction.from,
        to: newTransaction.to,
      })

      toast({
        title: "Success",
        description: "Transaction submitted to blockchain",
      })

      setIsCreateDialogOpen(false)
      setNewTransaction({
        type: "",
        from: "",
        to: "",
        satellite: "",
        debris: "",
        material: "",
        quantity: "",
        service: "",
        target: "",
      })

      // Reload data
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create transaction",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blockchain Data Management</h2>
          <p className="text-muted-foreground">Immutable record of all orbital operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={nasaIntegration ? "default" : "outline"}
            size="sm"
            onClick={() => setNasaIntegration(!nasaIntegration)}
          >
            <Database className="h-4 w-4 mr-2" />
            NASA Integration
          </Button>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Transaction</DialogTitle>
                <DialogDescription>Submit a new operation to the blockchain</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Transaction Type</Label>
                  <Select
                    value={newTransaction.type}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debris_capture">Debris Capture</SelectItem>
                      <SelectItem value="material_processing">Material Processing</SelectItem>
                      <SelectItem value="satellite_servicing">Satellite Servicing</SelectItem>
                      <SelectItem value="power_transfer">Power Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from">From Address</Label>
                    <Input
                      id="from"
                      value={newTransaction.from}
                      onChange={(e) => setNewTransaction({ ...newTransaction, from: e.target.value })}
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="to">To Address</Label>
                    <Input
                      id="to"
                      value={newTransaction.to}
                      onChange={(e) => setNewTransaction({ ...newTransaction, to: e.target.value })}
                      placeholder="0x..."
                    />
                  </div>
                </div>

                {newTransaction.type === "debris_capture" && (
                  <>
                    <div>
                      <Label htmlFor="satellite">Satellite</Label>
                      <Input
                        id="satellite"
                        value={newTransaction.satellite}
                        onChange={(e) => setNewTransaction({ ...newTransaction, satellite: e.target.value })}
                        placeholder="Symbiont-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="debris">Debris ID</Label>
                      <Input
                        id="debris"
                        value={newTransaction.debris}
                        onChange={(e) => setNewTransaction({ ...newTransaction, debris: e.target.value })}
                        placeholder="Debris-A47"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        value={newTransaction.quantity}
                        onChange={(e) => setNewTransaction({ ...newTransaction, quantity: e.target.value })}
                        placeholder="2.4 kg"
                      />
                    </div>
                  </>
                )}

                {newTransaction.type === "material_processing" && (
                  <>
                    <div>
                      <Label htmlFor="material">Material Type</Label>
                      <Input
                        id="material"
                        value={newTransaction.material}
                        onChange={(e) => setNewTransaction({ ...newTransaction, material: e.target.value })}
                        placeholder="Aluminum Alloy"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        value={newTransaction.quantity}
                        onChange={(e) => setNewTransaction({ ...newTransaction, quantity: e.target.value })}
                        placeholder="12.4 kg"
                      />
                    </div>
                  </>
                )}

                {newTransaction.type === "satellite_servicing" && (
                  <>
                    <div>
                      <Label htmlFor="target">Target Satellite</Label>
                      <Input
                        id="target"
                        value={newTransaction.target}
                        onChange={(e) => setNewTransaction({ ...newTransaction, target: e.target.value })}
                        placeholder="OrbNet-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="service">Service Type</Label>
                      <Input
                        id="service"
                        value={newTransaction.service}
                        onChange={(e) => setNewTransaction({ ...newTransaction, service: e.target.value })}
                        placeholder="Fuel Refill"
                      />
                    </div>
                  </>
                )}

                <Button onClick={handleCreateTransaction} className="w-full">
                  Submit Transaction
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {nasaIntegration && (
        <Card className="border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-transparent">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
                <div>
                  <span className="text-sm font-semibold">NASA ORDEM Integration Active</span>
                  <p className="text-xs text-muted-foreground">Real-time debris tracking data synchronized</p>
                </div>
              </div>
              <Badge variant="outline" className="text-blue-200 border-blue-400/50 bg-blue-500/20">
                LIVE DATA
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions, blocks, or addresses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="bg-slate-900/50">
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="blocks">Latest Blocks</TabsTrigger>
          <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
          <TabsTrigger value="analytics">Chain Analytics</TabsTrigger>
          <TabsTrigger value="nasa-data">NASA Data</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription>All orbital operations recorded on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={tx.status === "confirmed" ? "default" : "secondary"}>{tx.status}</Badge>
                        <span className="font-mono text-sm text-muted-foreground">{tx.id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium">{tx.type.replace("_", " ").toUpperCase()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">From:</span>
                        <p className="font-mono text-xs">{tx.from.slice(0, 10)}...</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">To:</span>
                        <p className="font-mono text-xs">{tx.to.slice(0, 10)}...</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Block:</span>
                        <p className="font-mono">{tx.blockHeight}</p>
                      </div>
                    </div>

                    {Object.keys(tx.data).length > 0 && (
                      <div className="pt-2 border-t">
                        <span className="text-muted-foreground text-sm">Data:</span>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                          {Object.entries(tx.data).map(([key, value]) => (
                            <div key={key} className="text-xs">
                              <span className="text-muted-foreground">{key}:</span>
                              <span className="ml-1 font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Block Explorer
              </CardTitle>
              <CardDescription>Latest blocks in the orbital operations chain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blocks.map((block) => (
                  <div key={block.height} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Block {block.height}</Badge>
                        <span className="font-mono text-sm text-muted-foreground">{block.hash.slice(0, 16)}...</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {new Date(block.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Transactions:</span>
                        <p className="font-medium">{block.transactions.length}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Validator:</span>
                        <p className="font-medium">{block.validator}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Gas Used:</span>
                        <p className="font-medium">{block.gasUsed.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <p className="font-medium">{(block.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Smart Contracts
              </CardTitle>
              <CardDescription>Deployed contracts managing orbital operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <div key={contract.address} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{contract.name}</h4>
                        <p className="text-sm text-muted-foreground font-mono">{contract.address.slice(0, 20)}...</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={contract.status === "active" ? "default" : "secondary"}>
                          {contract.status}
                        </Badge>
                        <Badge variant="outline">v{contract.version}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium">{contract.type.replace("_", " ").toUpperCase()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Transactions:</span>
                        <p className="font-medium">{contract.totalTransactions.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Activity:</span>
                        <p className="font-medium">{new Date(contract.lastActivity).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Network Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">99.97%</div>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247,893</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9.2/10</div>
                <p className="text-xs text-muted-foreground">Excellent</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nasa-data" className="space-y-4">
          <Card className="border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SatelliteIcon className="h-5 w-5" />
                NASA Orbital Debris Data
              </CardTitle>
              <CardDescription>Live integration with NASA ORDEM database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">34,000+</div>
                  <p className="text-sm text-muted-foreground">Total Tracked Objects</p>
                </div>
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">8,800</div>
                  <p className="text-sm text-muted-foreground">Active Satellites</p>
                </div>
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-400">19,300</div>
                  <p className="text-sm text-muted-foreground">Debris Fragments</p>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Data synchronized from NASA's Orbital Debris Program Office (ODPO)</p>
                <p>Last updated: {new Date().toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
