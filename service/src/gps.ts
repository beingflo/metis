import { db } from "./db";

export const pushGPS = ({ body }: { body: any }) => {
  const query = db.query(
    "INSERT INTO data (timestamp, data) VALUES ($timestamp, $data)"
  );

  body.locations.forEach((loc: any) => {
    query.run({
      $timestamp: new Date(loc.properties.timestamp).toISOString(),
      $data: JSON.stringify(loc),
    });
  });

  return {
    result: "ok",
  };
};

export const getGPS = () => {
  const qry = db.query(
    "SELECT data ->> '$.geometry.coordinates[0]' as longitude, data ->> '$.geometry.coordinates[1]' as latitude FROM data ORDER BY timestamp;"
  );
  const results = qry.all() as Array<{ longitude: number; latitude: number }>;

  return results?.map((r) => `${r.latitude}, ${r.longitude}`)?.join("\n");
};
