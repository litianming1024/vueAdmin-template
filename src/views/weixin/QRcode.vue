<template>
  <div class="app-container calendar-list-container">
    <data-tables-server :total="total" :actions-def="actionsDef"
                        :action-col-def="actionColDef" :load-data="loadData"
                        :data="tableData" >
      <el-table-column v-for="title in extraTitles" :key="title.id" :prop="title.prop" :label="title.label" sortable="custom">
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="title in titles" :key="title.id" :prop="title.prop" :label="title.label" sortable="custom">
      </el-table-column>
    </data-tables-server>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center>
      <el-form v-if="dialogStatus!='delete'" :rules="rules" ref="dataForm" :model="temp" label-width="100px">
        <!--label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'-->
        <!--<el-form-item v-for="title in titles" :key="title.prop" :label="title.label" >-->
          <!--<el-input v-model="temp[title.prop]" placeholder=""></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="场景值ID">
          <el-input v-model="temp.sceneStr"/>
        </el-form-item>
        <el-form-item label="有效时间">
          <el-input-number v-model="expireSeconds.days" controls-position="right" label="天" :min="0" :max="30"/><span>天</span>
          <el-input-number v-model="expireSeconds.minutes" controls-position="right" label="分钟" :min="0" :max="60"/><span>分钟</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
        <el-button v-if="dialogStatus=='update'" type="primary" @click="updateData">确认</el-button>
        <el-button v-if="dialogStatus=='delete'" type="danger" @click="deleteData">删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as QRcodeApi from '@/api/weixin/QRcode'

  export default {
    name: 'QRcode',
    data() {
      return {
        tableData: [],
        total: 0,
        extraTitles: [{
          prop: 'id',
          label: '序号'
        }, {
          prop: 'count',
          label: '扫码人数'
        }],
        titles: [{
          prop: 'actionName',
          label: '二维码类型'
        }, {
          prop: 'expireSeconds',
          label: '有效时间'
        }, {
          prop: 'sceneId',
          label: '场景值ID'
        }, {
          prop: 'sceneStr',
          label: '场景值ID(字符串)'
        }],
        expireSeconds: {
          days: 0,
          minutes: 0
        },
        temp: {
          id: Number,
          expireSeconds: '',
          sceneStr: ''
        },
        downloadLoading: false,
        dialogFormVisible: false,
        dialogStatus: '',
        multipleSelection: [],
        textMap: {
          update: '编辑',
          create: '添加',
          delete: '删除'
        },
        rules: {},
        actionsDef: {
          colProps: {
            span: 12
          },
          def: [{
            name: '添加',
            icon: 'el-icon-plus',
            handler: () => {
              this.handleCreate()
            }
          }]
        },
        actionColDef: {
          label: '操作',
          fixed: 'right',
          tableColProps: {
            align: 'center'
          },
          colProps: {
            span: 12
          },
          def: [{
            name: '下载',
            type: 'primary',
            handler: row => {
              this.handlerDownload(row)
            }
          }
          //   {
          //   name: '编辑',
          //   type: 'primary',
          //   handler: row => {
          //     this.handleUpdate(row)
          //   }
          // }, {
          //   name: '删除',
          //   type: 'danger',
          //   handler: row => {
          //     this.handleDelete(row)
          //   }
          // }
          ]
        }
      }
    },
    created() {
    },
    methods: {
      loadData(queryInfo) {
        return QRcodeApi.fetchList(queryInfo).then(response => {
          this.tableData = response.data.content
          this.total = response.data.totalElements
        })
      },
      resetTemp() {
        this.temp = {
          id: null,
          actionName: null,
          expireSeconds: '',
          sceneId: null,
          sceneStr: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.expireSeconds = this.expireSeconds.days * 86400 + this.expireSeconds.minutes * 60
            QRcodeApi.createData(this.temp).then((response) => {
              this.tableData.unshift(response.data)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success'
              })
            })
          }
        })
      },
      handlerDownload(row) {
        window.open('https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + row.ticket)
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            QRcodeApi.updateData(tempData.id, tempData).then(() => {
              for (const v of this.tableData) {
                if (v.id === this.temp.id) {
                  const index = this.tableData.indexOf(v)
                  this.tableData.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success'
              })
            })
          }
        })
      },
      handleDelete(row) {
        this.temp = row
        this.dialogStatus = 'delete'
        this.dialogFormVisible = true
      },
      deleteData() {
        QRcodeApi.deleteData(this.temp.id).then(() => {
          const index = this.tableData.indexOf(this.temp)
          this.tableData.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.$notify({
            message: '删除失败',
            type: 'error',
            duration: 2000
          })
        })
        this.dialogFormVisible = false
      }
    }
  }
</script>

