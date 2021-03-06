import NewDetailPage from "../../components/meetups/newDetailPage";
import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";

const newDescription = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.CarXData.title}</title>
        <meta name="description" content={props.CarXData.description} />
      </Head>
      <NewDetailPage
        image={props.CarXData.image}
        title={props.CarXData.title}
        description={props.CarXData.description}
        address={props.CarXData.address}
      />
    </Fragment>
  );
};
export async function getStaticPaths() {
  const Key = process.env.PASSWORD;
  const client = await MongoClient.connect(
    `mongodb+srv://AliQans:${Key}@cluster0.r2ac1.mongodb.net/carX?retryWrites=true&w=majority`
  );
  const db = client.db();
  const carsCollection = db.collection("carX");
  const carX_Dettail = await carsCollection.find({}, { _id: 1 }).toArray();
  client.close();
  return {
    fallback: "blocking",
    paths: carX_Dettail.map((Genrated) => ({
      params: { meetupId: Genrated._id.toString() },
    })),
  };
}
export async function getStaticProps(context) {
  const Key = process.env.PASSWORD;
  const contextPath = context.params.meetupId;
  const client = await MongoClient.connect(
    `mongodb+srv://AliQans:${Key}@cluster0.r2ac1.mongodb.net/carX?retryWrites=true&w=majority`
  );
  const db = client.db();
  const carsCollection = db.collection("carX");
  const selectedCar = await carsCollection.findOne({
    _id: ObjectId(contextPath),
  });
  client.close();
  console.log(contextPath);
  return {
    props: {
      CarXData: {
        id: selectedCar._id.toString(),
        image: selectedCar.image,
        title: selectedCar.title,
        address: selectedCar.address,
        description: selectedCar.description,
      },
    },
    revalidate: 1,
  };
}
export default newDescription;
