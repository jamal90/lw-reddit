import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useReadPostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ fetching, data }] = useReadPostsQuery();

  return (
    <div>
      <NavBar />
      <div>Hey, there!</div>
      <br />
      {!data ? (
        <div> No Posts </div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
