export class TreeNode {
    val: string;
    left: TreeNode | null;
    right: TreeNode | null;
    
    constructor(val: string, left: TreeNode | null = null, right: TreeNode | null = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    };
    
    static CreateTreeInOrder(elements: string[]) {
        if(elements.length === 0) return null;
        let root: TreeNode = new TreeNode(elements[0]);
        let queue: TreeNode[] = [root];
        let i = 1;
        
        while (i < elements.length) {
            const curr = queue.shift();
            if (!curr) break;
            
            if (i < elements.length) {
                curr.left = new TreeNode(elements[i]);
                queue.push(curr.left);
                i++;
            }
            
            if (i < elements.length) {
                curr.right = new TreeNode(elements[i]);
                queue.push(curr.right);
                i++;
            }
        }
        return root;
    }
    
    static printTree(root: TreeNode) {
        let Ans: string[][] = [];
        let queue: TreeNode[] = [];
        queue.push(root);
        
        while(queue.length > 0) {
            let CurrLevel: string[] = [];
            let size = queue.length;
            for(let i = 0; i < size; i++) {
                let curr = queue.shift();
                if (!curr) continue;
                CurrLevel.push(curr.val);
                if(curr.left) queue.push(curr.left);
                if(curr.right) queue.push(curr.right);
            }
            
            Ans.push(CurrLevel);
        }
        return Ans;
    }
    
    static Dfs(root: TreeNode, moves: TreeNode[]) {
        if (!root) return;
        moves.push(root);
        if(root.left) this.Dfs(root.left, moves);
        if(root.right) this.Dfs(root.right, moves);
    }
}