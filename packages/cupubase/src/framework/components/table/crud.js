export const crudOptions = gparam => {
  return Object.assign(
    {
      options: {
        height: "99.5%",
        rowKey: gparam.key_,
        highlightCurrentRow: !gparam.multipleSelect
      },
      indexRow: gparam.indexRow
        ? gparam.indexRow
        : {
            //title: "序号",
            title: gparam.$t("common.field.serialNumber"),
            align: "center",
            fixed: "left",
            width: 60
          },
      selectionRow: gparam.multipleSelect
        ? {
            align: "center",
            width: 50
          }
        : null,
      columns: gparam.columns,
      pagination: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 20,
        total: 0,
        background: true,
        layout: "total, sizes, prev, pager, next, jumper"
      },
      rowHandle: false
    },
    gparam.nativeProp
  )
}
