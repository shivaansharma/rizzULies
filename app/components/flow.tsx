'use client'
import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Handle,
  Position,
  BackgroundVariant,
} from '@xyflow/react';
import { TreeNode } from '@/app/algo/tree-algo';
 
import '@xyflow/react/dist/style.css';


const TreeNodeComponent = ({ data }:{data : any}) => {
  const bgColor = data.highlight ? 'bg-red-500 border-red-700' : 'bg-green-500 border-green-700';
  
  return (
    <div
      className={`flex items-center justify-center rounded-full ${bgColor} text-white border-2 w-16 h-16 relative`}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      <Handle type="source" position={Position.Left} className="w-2 h-2" />
      <Handle type="target" position={Position.Right} className="w-2 h-2" />
      {data.label}
    </div>
  );
};


const nodeTypes = {
  treeNode: TreeNodeComponent,
};


const convertTreeToFlowElements = (treeRoot) => {
  if (!treeRoot) return { nodes: [], edges: [] };
  
  const nodes = [];
  const edges = [];
  const queue = [{ node: treeRoot, id: '0', x: 0, y: 0, level: 0 }];
  const levelWidthMap = new Map();
  const nodeMap = new Map(); 
  
  while (queue.length > 0) {
    const { node, id, x, y, level } = queue.shift();
    
   
    if (!levelWidthMap.has(level)) {
      levelWidthMap.set(level, 0);
    } else {
      levelWidthMap.set(level, levelWidthMap.get(level) + 1);
    }
    
   
    nodes.push({
      id,
      position: { x: x, y: y * 100 },
      data: { label: node.val, treeNode: node, highlight: false },
      type: 'treeNode',
    });
    
   
    nodeMap.set(node, id);
    
   
    if (node.left) {
      const leftId = `${id}-left`;
      const leftX = x - 150 / (level + 1);
      queue.push({ 
        node: node.left, 
        id: leftId, 
        x: leftX, 
        y: level + 1, 
        level: level + 1 
      });
      
      
      edges.push({
        id: `e-${id}-${leftId}`,
        source: id,
        target: leftId,
        animated: true,
        style: { stroke: '#444', strokeWidth: 2 },
        label: 'left',
      });
    }
    
   
    if (node.right) {
      const rightId = `${id}-right`;
      const rightX = x + 150 / (level + 1);
      queue.push({ 
        node: node.right, 
        id: rightId, 
        x: rightX, 
        y: level + 1, 
        level: level + 1 
      });
      
     
      edges.push({
        id: `e-${id}-${rightId}`,
        source: id,
        target: rightId,
        animated: true,
        style: { stroke: '#444', strokeWidth: 2 },
        label: 'right',
      });
    }
  }
  
  return { nodes, edges, nodeMap };
};


const CodeEditor = ({ code, setCode, runCode }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <textarea
        className="font-mono p-2 border border-gray-300 rounded h-64 text-sm"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck="false"
      />
     
    </div>
  );
};


const DEFAULT_ALGORITHM = `// Custom Tree Traversal Algorithm
// Available functions:
// - highlightNode(nodeId): Highlights a node
// - clearHighlights(): Clears all highlights
// - sleep(ms): Pauses execution for ms milliseconds
// - getRoot(): Gets the root TreeNode

async function customTraversal() {
  clearHighlights();
  const root = getRoot();
  if (!root) return;
  
  // Example: Custom traversal (pre-order)
  await traverse(root);
  
  async function traverse(node) {
    if (!node) return;
    
    // Process current node
    await highlightNode(node);
    await sleep(500);
    
    // Process children
    if (node.left) await traverse(node.left);
    if (node.right) await traverse(node.right);
  }
}

// Execute the traversal
customTraversal();`;

const DFS_ALGORITHM = `// Depth-First Search (Pre-order)
async function dfs() {
  clearHighlights();
  const root = getRoot();
  if (!root) return;
  
  const stack = [root];
  
  while (stack.length > 0) {
    const node = stack.pop();
    await highlightNode(node);
    await sleep(500);
    
    // Push right first so left gets processed first (stack is LIFO)
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
}

dfs();`;

const BFS_ALGORITHM = `// Breadth-First Search
async function bfs() {
  clearHighlights();
  const root = getRoot();
  if (!root) return;
  
  const queue = [root];
  
  while (queue.length > 0) {
    const node = queue.shift();
    await highlightNode(node);
    await sleep(500);
    
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}

bfs();`;

export default function TreeVisualizer() {
  const [treeData, setTreeData] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [algorithm, setAlgorithm] = useState(DEFAULT_ALGORITHM);
  const [rootNode, setRootNode] = useState(null);
  const [nodeMap, setNodeMap] = useState(new Map());
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState("custom");
  
  
  const abortController = useRef(null);
  
  
  const onConnect = useCallback(
    (params) => {
      
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: '#444', strokeWidth: 2 }
      };
      return setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges],
  );


  const handleCreateTree = () => {
    try {
    
      const elements = treeData.split(',').map(item => item.trim());
     
      const root = TreeNode.CreateTreeInOrder(elements);
      setRootNode(root);
     
      const { nodes: treeNodes, edges: treeEdges, nodeMap: treeNodeMap } = convertTreeToFlowElements(root);
     
      setNodes(treeNodes);
      setEdges(treeEdges);
      setNodeMap(treeNodeMap);
    } catch (error) {
      console.error("Error creating tree:", error);
      alert("Error creating tree. Please check your input format.");
    }
  };

  
  const handleSampleTree = () => {
    const sampleData = "A,B,C,D,E,F,G";
    setTreeData(sampleData);
  };

  
  useEffect(() => {
    switch(selectedAlgo) {
      case "dfs":
        setAlgorithm(DFS_ALGORITHM);
        break;
      case "bfs":
        setAlgorithm(BFS_ALGORITHM);
        break;
      case "custom":
        setAlgorithm(DEFAULT_ALGORITHM);
        break;
      default:
        setAlgorithm(DEFAULT_ALGORITHM);
    }
  }, [selectedAlgo]);

 
  const highlightNode = async (treeNode) => {
    const nodeId = nodeMap.get(treeNode);
    if (!nodeId) return;
    
    setNodes(currentNodes => 
      currentNodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, highlight: true } }
          : node
      )
    );
    return new Promise(resolve => setTimeout(resolve, 10));
  };

  
  const clearHighlights = () => {
    setNodes(currentNodes => 
      currentNodes.map(node => ({ 
        ...node, 
        data: { ...node.data, highlight: false } 
      }))
    );
    return new Promise(resolve => setTimeout(resolve, 10));
  };

 
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  
  const runAlgorithm = async () => {
    if (isRunning) {
     
      if (abortController.current) {
        abortController.current.abort();
        abortController.current = null;
      }
      setIsRunning(false);
      return;
    }

    setIsRunning(true);
    clearHighlights();
    
    
    abortController.current = new AbortController();
    const signal = abortController.current.signal;

    try {
      
      const getRoot = () => rootNode;
      const asyncFunction = new Function(
        'highlightNode', 
        'clearHighlights', 
        'sleep', 
        'getRoot',
        'signal',
        `return (async () => {
          try {
            ${algorithm}
          } catch (e) {
            if (e.name === 'AbortError') {
              console.log('Algorithm execution aborted');
            } else {
              throw e;
            }
          }
        })()`
      );
      
     
      await asyncFunction(
        highlightNode, 
        clearHighlights, 
        sleep, 
        getRoot,
        signal
      );
    } catch (error) {
      console.error("Error running algorithm:", error);
      alert(`Error running algorithm: ${error.message}`);
    } finally {
      setIsRunning(false);
      abortController.current = null;
    }
  };

 
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return (
    <div className="w-screen h-screen flex">
      <div className="w-2/3 h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode="Delete"
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Panel position="top-left" className="bg-white p-4 rounded-md shadow-md">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Enter tree values (comma separated):
                <input
                  type="text"
                  value={treeData}
                  onChange={(e) => setTreeData(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="A,B,C,D,E,F,G"
                />
              </label>
              <div className="flex gap-2">
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleCreateTree}
                >
                  Visualize Tree
                </button>
                <button 
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={handleSampleTree}
                >
                  Sample Tree
                </button>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>
      <div className="w-1/3 h-full p-4 overflow-y-auto bg-gray-100">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Tree Traversal Algorithms</h2>
          
          <div className="flex gap-2">
            <button 
              className={`px-4 py-2 rounded ${selectedAlgo === 'dfs' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedAlgo('dfs')}
            >
              DFS
            </button>
            <button 
              className={`px-4 py-2 rounded ${selectedAlgo === 'bfs' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedAlgo('bfs')}
            >
              BFS
            </button>
            <button 
              className={`px-4 py-2 rounded ${selectedAlgo === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedAlgo('custom')}
            >
              Custom
            </button>
          </div>
          
          <CodeEditor 
            code={algorithm} 
            setCode={setAlgorithm} 
            runCode={runAlgorithm} 
          />
          
          <button 
            className={`px-4 py-2 rounded ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
            onClick={runAlgorithm}
          >
            {isRunning ? 'Stop Execution' : 'Run Algorithm'}
          </button>
          
          <div className="bg-white p-4 rounded-md shadow mt-4">
            <h3 className="font-bold mb-2">Available Functions:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><code className="bg-gray-100 px-1 rounded">highlightNode(node)</code>: Highlight a tree node</li>
              <li><code className="bg-gray-100 px-1 rounded">clearHighlights()</code>: Clear all highlights</li>
              <li><code className="bg-gray-100 px-1 rounded">sleep(ms)</code>: Pause execution for ms milliseconds</li>
              <li><code className="bg-gray-100 px-1 rounded">getRoot()</code>: Get the root TreeNode</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}