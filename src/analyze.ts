import * as vscode from 'vscode';
import { parse } from '@babel/parser';
import traverse from "@babel/traverse";
import generate from "@babel/generator";

const mock1 = `pageNo：当前页
pageSize：页面大小
total:总数量
rows: 审核记录列表
pId: 申请单id
type,审核方式 6为释放酒店人工审核，7为释放酒店系统审核
isPass：是否审核通过，Y为审核通过，F为审核不通过
checker: 审核人
auditTime: 审核时间
reason： 原因`

const mock2 = `pageNo：当前页

pageSize：页面大小

total:总数量

rows: 审核记录列表

- pId: 申请单id
  
- type,审核方式 6为释放酒店人工审核，7为释放酒店系统审核
  
- isPass：是否审核通过，Y为审核通过，F为审核不通过
  
- checker: 审核人
  
- auditTime: 审核时间
  
- reason： 原因`

const mock3 = `success	boolean	成功还是失败
code	int	返回码
msg	String	错误文案`

const typeMap = {
  'BOOLEAN': 'boolean',
  'INT': 'number',
  'LONG': 'number',
  'SHORT': 'number',
  'BYTE': 'number',
  'FLOAT': 'number',
  'DOUBLE': 'number',
  'STRING': 'string',
  'CHAR': 'string',
  'LIST': 'array',
}

interface Word {
  wordType: 'desc' | 'key' | 'value' | 'type' | 'other',
  value: string,
}

interface Obj {
  key: string,
  value?: string,
  type?: 'boolean' | 'number' | 'string' | 'array',
  desc?: string,
}

/**
 * 分析一个对象，很可能是一个 JSON，将其转换为一个接口
 */
const analyze = (object: string) => {
  console.log('%cobject', 'background-color: darkorange', object);
  const ast = parse(object, {
    sourceType: "module",
    plugins: ['typescript']
  })

  traverse(ast, {
    ObjectProperty(path: any) {
      if (path.node.value.type === 'ArrayExpression') {
        path.node.value = path.node.value.elements[0];

        const val = path.node.value.value;
        if (val) {

        }

      } else {

        const val = path.node.value.value
        if (val) {
          path.node.value.type = 'NumericLiteral';
          path.node.value.value = getType(val);
        }
      }
    },
  });

  const output = generate(ast);

  console.log('%coutput', 'background-color: darkorange', output.code);
  return;
}

function getType(val: any): string {

  let _type = '';

  if (typeof val === 'boolean') {
    _type = 'boolean';
  }

  if (typeof val === 'number') {
    _type = 'number';
  }

  if (typeof val === 'string') {
    if (/^[\d]*\.?[\d]*$/.test(val)) {
      _type = 'number';
    } else {
      _type = 'string';
    }
  }

  return _type;
}


export default analyze;