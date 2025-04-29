'use client'
import { TreeNode } from "@/app/algo/tree-algo"
import { useEffect, useState } from "react"

export default function BinaryTrees() {
    const [inputValue, setInputValue] = useState("");
    const [levels, setLevels] = useState<string[][]>([]);
    const [root ,setRoot] = useState<TreeNode>();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    
    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("Submitted value:", inputValue);
        const Root = TreeNode.CreateTreeInOrder(inputValue)
        if(!Root)return
        setRoot(Root);
        if (root) {
            const level = TreeNode.printTree(Root);
            setLevels(level)
            console.log(levels);
        } else {
            console.log("No tree to print");
        }
    };
    
    useEffect(() => {
        function DisplayTree(data: string[][]) {
            const treeDisplay = document.getElementById("treeDisplay");
            if (!treeDisplay) return;
        
            while (treeDisplay.firstChild) {
                treeDisplay.removeChild(treeDisplay.firstChild);
            }
            
           
            if (data.length === 0) {
                const emptyMessage = document.createElement("div");
                emptyMessage.className = "flex items-center justify-center h-full text-gray-400";
                emptyMessage.textContent = "Enter values and click 'Visualize Tree' to see the result";
                treeDisplay.appendChild(emptyMessage);
                return;
            }
            
            
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.style.position = "absolute";
            svg.style.top = "0";
            svg.style.left = "0";
            svg.style.zIndex = "1";
            treeDisplay.appendChild(svg);
        
            const levelHeight = 120;
            const nodeWidth = 60;
        
            for (let i = 0; i < data.length; i++) {
                const nodesAtLevel = data[i].length;
                const spacing = 600 / (nodesAtLevel + 1);
        
                for (let j = 0; j < data[i].length; j++) {
                    const node = document.createElement("div");
                    node.className = "absolute h-16 w-16 bg-gradient-to-r from-pink-400 to-purple-500 flex justify-center items-center rounded-full text-white font-bold shadow-lg transition-all duration-300 hover:scale-110 z-10";
                    node.textContent = data[i][j];
        
                    const top = i * levelHeight + 20;
                    const left = (j + 1) * spacing - nodeWidth / 2;
        
                    node.style.top = `${top}px`;
                    node.style.left = `${left}px`;
                  
                        treeDisplay.appendChild(node);
                   
                   
                    if (i > 0) {
                        const parentIndex = Math.floor(j / 2);
                        if (parentIndex < data[i-1].length) { 
                            const parentLeft = (parentIndex + 1) * (600 / (data[i - 1].length + 1)) - nodeWidth / 2 + nodeWidth/2;
                            const parentTop = (i - 1) * levelHeight + 20 + nodeWidth/2;
                            
                            const startX = left + nodeWidth/2;
                            const startY = top;
                            const endX = parentLeft;
                            const endY = parentTop + nodeWidth/2;
                            
                          
                            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                            path.setAttribute("d", `M${startX},${startY} C${startX},${startY-30} ${endX},${endY+30} ${endX},${endY}`);
                            path.setAttribute("stroke", "#d946ef");
                            path.setAttribute("stroke-width", "2");
                            path.setAttribute("fill", "none");
                                svg.appendChild(path);
                        }
                    }
                }
            }
        }
    
        DisplayTree(levels);
    }, [levels]);

   
    useEffect(() => {
        const div = document.getElementById('node');
        let toggle = false;

        const interval = setInterval(() => {
            if (div) {
                div.className = toggle? "h-20 w-20 bg-red-400 flex justify-center items-center rounded-full": "h-20 w-20 bg-blue-400 flex justify-center items-center rounded-full";
                toggle = !toggle;
            }
        }, 1000);

        return () => clearInterval(interval); 
    }, []);

    return (
        <div className="flex flex-col max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6 text-purple-600">Binary Tree Visualizer</h1>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input 
                    id="inputBox" 
                    type="text" 
                    className="flex-1 px-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700" 
                    placeholder="Enter nodes in order (e.g. 10,20,30,40,50)" 
                    onChange={handleInputChange} 
                    value={inputValue}
                />
                <button 
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg shadow hover:from-pink-600 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onClick={handleSubmit}
                >
                    Visualize Tree
                </button>
            </div>
            
            <div id="treeDisplay" className="relative w-full h-[600px] bg-white rounded-lg border border-gray-200 overflow-auto shadow-inner">
            </div>
            
            <div className="mt-4 text-sm text-gray-500 text-center">
                Hover over nodes to highlight them
            </div>
        </div>
    )
}