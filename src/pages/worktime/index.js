import React, { useState } from 'react';
import { Checkbox, Typography, Space, TimePicker, Button, Divider } from 'antd';
import moment, { time } from 'moment';
import Styles from './index.css';
const CheckboxGroup = Checkbox.Group;
const format = 'HH:mm:ss';
const { Text, Link } = Typography;

const timeBoundary = {
  amStart: time,
  amEnd: time,
  pmStart: time,
  pmEnd: time,
};
const checkList = [
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期日',
];
const defaultCheckedList = ['星期一', '星期二', '星期三', '星期四', '星期五'];

const amS = '09:00:00';
const amE = '12:00:00';
const pmS = '13:00:00';
const pmE = '18:00:00';

export default () => {
  const [tb, setState] = useState(timeBoundary);
  tb.amStart = moment(amS, format);
  tb.amEnd = moment(amE, format);
  tb.pmStart = moment(pmS, format);
  tb.pmEnd = moment(pmE, format);
  const cal = () => {
    const now = new Date();
    const position = now.getDay() - 1;
    if (position === -1) position = position + 7;
    var pastDay = 0;
    const calList = [];
    checkedList.map(val => {
      const index = checkList.indexOf(val);
      calList.push(index);
      if (position > index) pastDay++;
    });
    const amStartTime = tb.amStart.toDate().getTime();
    const amEndTime = tb.amEnd.toDate().getTime();
    const pmStartTime = tb.pmStart.toDate().getTime();
    const pmEndTime = tb.pmEnd.toDate().getTime();
    const amTotal = amEndTime - amStartTime;
    const pmTotal = pmEndTime - pmStartTime;
    const dayTotal = amTotal + pmTotal;
    const total = dayTotal * calList.length;
    var todayTotal = 0;
    if (calList.indexOf(position) >= 0) {
      const positionTime = now.getTime();
      if (positionTime <= amStartTime) todayTotal = 0;
      else if (positionTime > amStartTime && positionTime < amEndTime)
        todayTotal = positionTime - amStartTime;
      else if (positionTime >= amEndTime && positionTime <= pmStartTime)
        todayTotal = amTotal;
      else if (positionTime > pmStartTime && positionTime < pmEndTime)
        todayTotal = amTotal + positionTime - pmStartTime;
      else if (positionTime >= pmEndTime) pastDay++;
    }
    // console.log('todayTotal:', todayTotal)
    var p = ((pastDay * dayTotal + todayTotal) / total) * 100;
    // console.log('persent:', p)
    setPersent(p.toFixed(2) + '');
  };

  const onchange = (time, timeString, position) => {
    if (position === 0) {
      tb.amStart = time;
    } else if (position === 1) {
      tb.amEnd = time;
    } else if (position === 2) {
      tb.pmStart = time;
    } else if (position === 3) {
      tb.pmEnd = time;
    }
    setState(tb);
  };

  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [persentText, setPersent] = useState('00.00');

  const onChange = list => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < checkList.length);
    setCheckAll(list.length === checkList.length);
  };

  const onCheckAllChange = e => {
    setCheckedList(e.target.checked ? checkList : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  return (
    <div className={Styles.rootbackground}>
      <div>
        <Text>您每周的工作时间：</Text> <Divider type={'vertical'} />
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          全选
        </Checkbox>
      </div>
      <div>
        <Divider />
        <CheckboxGroup
          options={checkList}
          value={checkedList}
          onChange={onChange}
        />
        <Divider />
      </div>
      <div>
        {/* <h1 className={styles.title}>Page worktime/index</h1> */}
        <Text>您上午的上班时间</Text>
        <Divider type={'vertical'} />
        <Text>开始：</Text>
        <TimePicker
          onChange={(time, timeString) => onchange(time, timeString, 0)}
          defaultValue={tb.amStart}
          format={format}
        />
        <Divider type={'vertical'} />
        <Text>结束：</Text>
        <TimePicker
          onChange={(time, timeString) => onchange(time, timeString, 1)}
          defaultValue={tb.amEnd}
          format={format}
        />
        <Divider />
      </div>
      <div>
        <Text>您下午的上班时间</Text>
        <Divider type={'vertical'} />
        <Text>开始：</Text>
        <TimePicker
          onChange={(time, timeString) => onchange(time, timeString, 2)}
          defaultValue={tb.pmStart}
          format={format}
        />
        <Divider type={'vertical'} />
        <Text>结束：</Text>
        <TimePicker
          onChange={(time, timeString) => onchange(time, timeString, 3)}
          defaultValue={tb.pmEnd}
          format={format}
        />
        <Divider />
      </div>
      <div>
        <Button type="primary" onClick={tb => cal(tb)}>
          计算
        </Button>
        <Divider type={'vertical'} />
        <Text>您本周工作时间已过去：{persentText}%</Text>
      </div>
    </div>
  );
};
