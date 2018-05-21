package scut.util.hbase;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.*;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.filter.Filter;
import org.apache.hadoop.hbase.filter.FilterList;
import org.apache.hadoop.hbase.filter.PageFilter;
import org.apache.log4j.Logger;
import scut.util.sql.SQLDaoFactory;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.Set;

/**
 * Created by Carrod on 2018/5/3.
 */
public class HBaseCli {

    private static Logger LOG = Logger.getLogger(HBaseCli.class);
    private static HBaseCli instance = null;
    private Configuration conf = null;
    private HBaseCli(){
        conf = HBaseConfiguration.create();
    };

    public static HBaseCli getInstance() {
        if (instance == null) {
            synchronized (SQLDaoFactory.class) {
                if (instance == null) {
                    instance = new HBaseCli();
                }
            }
        }
        return instance;
    }

    public Table getHBaseTable(String name){
        if (name==null) return null;
        this.conf.set("hbase.zookeeper.quorum","cu01,cu02,cu03,cu04,cu05,cu06");
        this.conf.set("hbase.zookeeper.property.clientPort","2181");
        this.conf.set("hbase.master", "mu01:60000");
        this.conf.set("mapreduce.output.fileoutputformat.outputdir", "/tmp");
        try {
            Connection connection = ConnectionFactory.createConnection(conf);
            LOG.info(String.format("与HBase表%s建立连接",name));
            return connection.getTable(TableName.valueOf(name));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 查询特定范围内的数据
     * @param table
     * @param startRowKey
     * @param endRowKey
     * @param columnArray
     * @param limit
     * @param sample 采样个数
     * @return
     */
    public JSONArray query(Table table,String startRowKey,String endRowKey,JSONArray columnArray,int limit, int sample){
        JSONArray data = new JSONArray();
        Scan scan = new Scan();
        if(sample<=0){
            // 获取全部
            if(limit>0){
                // 截取部分
                if(startRowKey!=null && !startRowKey.equals("")){
                    scan.setStartRow(startRowKey.getBytes());
                    scan.setMaxResultSize(limit);
                    scan.setStopRow(endRowKey.getBytes());
                }else{
                    scan.setReversed(true);
                    scan.setStartRow(endRowKey.getBytes());
                    scan.setMaxResultSize(limit);
                }
            }else{
                scan.setStartRow(startRowKey.getBytes());
                scan.setStopRow(endRowKey.getBytes());
            }
            // 开始查询
            try {
                ResultScanner result  = table.getScanner(scan);
                for (Result r : result) {
                    JSONObject rowObj = new JSONObject();
                    rowObj.put("CLSJ",new String(r.getRow()));
                    for(Object column: columnArray.toArray()){
                        Cell a = r.getColumnCells(
                                new String("family").getBytes(),
                                column.toString().getBytes()).get(0);
                        rowObj.put(column.toString(),new String(CellUtil.cloneValue(a)));
                    }
                    data.add(rowObj);
                }
            } catch (IOException e) {
                System.out.println("数据表" + table.getName() + "不存在！");
//                e.printStackTrace();
            }
        }else{
            // 采样

        }
        return data;
    }

    /**
     * 翻页功能
     * @param table
     * @param pageSize
     * @param next
     * @param rowKey
     * @param reversed 是否从大到下翻页
     * @param columns
     * @param otherInfo
     * @return
     */
    public JSONArray getPage(Table table, int pageSize, boolean next, String rowKey, boolean reversed, Set<String> columns, Map<String,String> otherInfo){
        // 增加下一行
        int nowPageSize = pageSize + 1;
        FilterList filterList = new FilterList(FilterList.Operator.MUST_PASS_ALL);
        Filter filter1 = new PageFilter(nowPageSize);
        filterList.addFilter(filter1);

        Scan scan = new Scan();
        scan.setReversed(reversed);
        scan.setFilter(filterList);
        scan.setMaxResultSize(nowPageSize);
        scan.setStartRow(rowKey.getBytes());
        if(!next){
            scan.setReversed(true);
        }

        JSONArray data = new JSONArray();
        try {
            ResultScanner result  = table.getScanner(scan);
            for (Result r : result) {
                JSONObject rowObj = new JSONObject();
                rowObj.put("CLSJ",new String(r.getRow()));
                for(String column: columns){
                    Cell a = r.getColumnCells(
                            new String("family").getBytes(),
                            new String(column).getBytes()).get(0);
                    rowObj.put(column,new String(CellUtil.cloneValue(a)));
                    rowObj.putAll(otherInfo);
                }
                data.add(rowObj);
            }
            if(!next)
                Collections.reverse(data);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e){
            e.printStackTrace();
        }
        return data;
    }
}
