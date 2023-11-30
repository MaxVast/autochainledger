import { NFTStorage } from "nft.storage"

const getImage = async () => {
    const r = await fetch("https://auto.suzuki.ch/fileadmin/media/images/cars/swift-sport/colours/swift-sport-1.jpg")
    if (!r.ok) {
        throw new Error(`error fetching image: [${r.statusCode}]: ${r.status}`)
    }
    return r.blob()
}
export async function storeNft (selectedBrand, carModel) {
    const image = await getImage()
    const nft = {
        image,
        //image: "https://auto.suzuki.ch/fileadmin/media/images/cars/swift-sport/colours/swift-sport-1.jpg",
        name: "NFT AutoChain Ledger",
        description: "This NFT is the identification book on the blockchain",
        properties: {
          brand: selectedBrand,
          model: carModel,
          authors: [{ name: "Autochain Ledger" }],
        }
    }
    const clientNftStorage = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDAxMTU4M2E5MjI4RmE2OEM5MUY2Y2VBMTBBZjkwNTc2RjRiMDNFRTMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3ODk3MjI5MjA2MSwibmFtZSI6IlN5bmVpZG9MYWIifQ.CvIOGho8zP_RFJ0rQ63EEw4AekYk9Au3avOJ6QhMZeE' })
    const metadata = await clientNftStorage.store(nft)
    console.log('NFT data stored!')
    console.log('Metadata URI: ', metadata.url)
    return metadata.url;
}