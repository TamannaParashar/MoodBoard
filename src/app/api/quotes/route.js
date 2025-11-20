import axios from "axios";

export async function GET(req){
    const mood = req.nextUrl.searchParams.get("mood");
    const limit = parseInt(req.nextUrl.searchParams.get("limit"))||10;
    const offset = parseInt(req.nextUrl.searchParams.get("offset")) || 0;

    try{
        const url = `https://api.quotify.top/search?q=${mood}&limit=${limit}`;
        const resp = await axios.get(url);
        const data = resp.data.slice(offset,limit+offset)
        return new Response(JSON.stringify(data),{status:200});
    }catch{
        return new Response(JSON.stringify({message:"cannot fetch quotes"}),{status:400});
    }
}