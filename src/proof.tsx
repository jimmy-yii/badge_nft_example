import { useState } from 'react'
import { StandardMerkleTree } from '@openzeppelin/merkle-tree'
import { WHITE_LIST_ADDRESS } from './abi'

export const ProofSection = () => {
  const [addresses, setAddresses] = useState(WHITE_LIST_ADDRESS.join('\n'))
  const [merkleRoot, setMerkleRoot] = useState('')
  const [tree, setTree] = useState<StandardMerkleTree<string[]> | null>(null)
  const [proofAddress, setProofAddress] = useState(WHITE_LIST_ADDRESS[0])
  const [proof, setProof] = useState<string[] | null>(null)
  const [isInTree, setIsInTree] = useState(false)

  const generateMerkleRoot = () => {
    const addressList = addresses.split('\n').filter(addr => addr.trim())
    const values = addressList.map(address => [address])
    const newTree = StandardMerkleTree.of(values, ['address'])
    setTree(newTree)
    setMerkleRoot(newTree.root)
    setProof(null)
  }

  const generateProof = () => {
    if (!tree || !proofAddress) return
    try {
      for (const [i, v] of tree.entries()) {
        if (v[0] === proofAddress) {
          const proof = tree.getProof(i)
          setIsInTree(true)
          setProof(proof)
          return
        }
      }
      setIsInTree(false)
      setProof([])
    } catch (error) {
      console.error('Error generating proof:', error)
      setProof([])
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Proof Playground</h1>
      <div className="space-y-2">
        <label className="block">
          Enter Ethereum whitelist addresses (one per line):
          <textarea
            className="w-full mt-1 p-2 border rounded-md min-h-[200px] font-mono"
            value={addresses}
            onChange={(e) => setAddresses(e.target.value)}
            placeholder="0x..."
          />
        </label>
        <button
          onClick={generateMerkleRoot}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Generate Merkle Root
        </button>
        {merkleRoot && (
          <div className="mt-4 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Merkle Root:</h2>
              <code className="block p-2 bg-gray-100 rounded-md break-all">
                {merkleRoot}
              </code>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Generate Proof</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border rounded-md font-mono"
                  placeholder="Enter address to generate proof"
                  value={proofAddress}
                  onChange={(e) => setProofAddress(e.target.value)}
                />
                <button
                  onClick={generateProof}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-green-600"
                >
                  Get Proof
                </button>
              </div>
              {proof !== null && (
                <div>
                  <h3 className="text-md font-semibold">Proof Result:</h3>
                  {proof &&
                    <pre className="p-2 bg-gray-100 rounded-md overflow-x-auto">
                      {JSON.stringify(proof, null, 2)}
                    </pre>
                  }
                  {!isInTree && (
                    <p className="text-red-500">Address is not in the tree</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}