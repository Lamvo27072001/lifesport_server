import executeDBScript from "../config/database";
import convertExportSheet from "../utils/convertExportSheet";
class ProductModel {
  async export_product() {
    const q = `SELECT id,name,quantity,price,description,brand,on_sales_id,status,sku,currency,thumbnail,images,color,slug
              FROM products`;
    const result = await executeDBScript(q)
      .then((res) => {
        const data = convertExportSheet(res);
        return data;
      })
      .catch((err) => {
        throw new Error(`Error:${err}`);
      });
    return result;
  }
  async import_product(insert_string: string) {
    const q = `INSERT INTO products(name,quantity,price,description,brand,on_sales_id,status,sku,currency,thumbnail,images,color,slug)
				VALUES	${insert_string}`;

    const result = await executeDBScript(q)
      .then((res) => {
        return { status: "success", message: "Import data successfully." };
      })
      .catch((err) => {
        throw new Error(`Error:${err}`);
      });
    return result;
  }
  async update_product(insert_string: string) {
    const q = `INSERT INTO products(id,name,quantity,price,description,brand,on_sales_id,status,sku,currency,thumbnail,images,color,slug)
				VALUES	${insert_string}
        ON CONFLICT (id) DO UPDATE
        SET 
        name=EXCLUDED.name,
        quantity=EXCLUDED.quantity,
        price=EXCLUDED.price,
        description=EXCLUDED.description,
        brand=EXCLUDED.brand,
        on_sales_id=EXCLUDED.on_sales_id,
        status=EXCLUDED.status,
        sku=EXCLUDED.sku,
        currency=EXCLUDED.currency,
        thumbnail=EXCLUDED.thumbnail,
        images=EXCLUDED.images,
        color=EXCLUDED.color,
        slug=EXCLUDED.slug,
        updated_at=NOW()`;

    const result = await executeDBScript(q)
      .then((res) => {
        return { status: "success", message: "Import data successfully." };
      })
      .catch((err) => {
        throw new Error(`Error:${err}`);
      });
    return result;
  }
  async list_products(limit: number = 12, page: number = 1) {
    const q = `SELECT id,name,price,status,brand,thumbnail,slug 
              FROM products
              LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
    const result = await executeDBScript(q);
    return result;
  }
  async product_detail(id: any) {
    const q = `SELECT t0.id, t0.name,(t0.price*(1-COALESCE (t2.percent_off,0))-COALESCE (t2.amount_off,0)) AS price, t0.description,t0.status,array_cat(t0.thumbnail,t0.images) as images,t1.comments, t1.avg_rate
                FROM products AS t0
                LEFT JOIN (
                  SELECT t0.ordered_product_id, jsonb_agg(jsonb_build_array('user_name',t1.name,'rate',t0.rating, 'comment',t0.comment,'created_at',t0.created_at)) as comments, avg(t0.rating)as avg_rate
                  FROM user_reviews AS t0
                  LEFT JOIN users AS t1 on t0.user_id= t1.id
                  GROUP BY t0.ordered_product_id
                )AS t1 ON t0.id = t1.ordered_product_id
                LEFT JOIN(
                  SELECT t0.code, t0.percent_off, t0.amount_off 
                    FROM on_sale_events AS t0
                    WHERE CURRENT_DATE>= t0.start_at
                    AND	CURRENT_DATE<=t0.end_at
                  ) AS t2 ON t2.code = t0.on_sales_id
                WHERE t0.id =${id}`;
    const result = await executeDBScript(q)
    return result;
  }
  async delete_products(ids: string) {
    const q = `DELETE FROM products WHERE id IN ${ids}`
    const result =await executeDBScript(q)
    return result;
  }
}
export default new ProductModel();
