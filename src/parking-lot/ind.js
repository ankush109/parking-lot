let arr = [2,3,1,1,4];
// either we take the maximum  ( the length  is the the diff of the array we can the maxi)

const find=(arr,ind)=>{
    if(ind == arr.length ) return true;
    let take,nottake;
    if(arr[ind]>1){
         nottake = find(arr,ind+1)
    }
    take = find(arr,arr[ind]);
    return take | nottake

}

// [10,5 120,7,8,6] kth largestqueue  2nd largsts 

f