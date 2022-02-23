import React, { Component } from 'react';
import { Button, Input, Slider } from 'antd';
import moment from 'moment';
import MyModal from '../../../components/Modal/Index';
import styles from '../css/loan.module.css';
import commonStyles from '../../../common/css/util.module.css';

interface Props {
    visible: boolean
    onCancle: any
    onSave: any
    approve: any
    isApprove: boolean
}

class CreateModal extends Component<Props> {
  state = {
    dueDate: 0,
    stepDueDate: 0,
    currentDate: Date.now(),
    redate: 0,
    currentDateFormat: null as any,
  };

  componentDidMount() {
    this.setState({
      currentDateFormat: moment(this.state.currentDate).format('YYYY-MM-DD'),
    });
  }

  public onDueDateChange = (val: any) => {
    const days = Math.floor(val * (0.30));
    const newDate = moment(this.state.currentDate).add(days, 'days');
    this.setState({
      dueDate: days,
      stepDueDate: val,
      currentDateFormat: newDate.format('YYYY-MM-DD'),
    });
  };

  /**
     *
     * 1 24 * 60 * 60 = 86400  秒
     * dueDate*86400
     */
  public handleDueDateChange = (e:any) => {
    this.setState({
      dueDate: e.target.value,
      stepDueDate: Number(e.target.value) / 3.65,
    });
  };

  public sliderDate() {
    return (
      <div className={styles.dueDateSlider}>
        <div onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
          <div className={styles.sliderTitle}>
            AUCTION TIME
            <span style={{ fontSize: 30 }}>Ⓘ</span>
          </div>
          <Slider
            value={this.state.stepDueDate}
            className={styles.percentSlider}
            tipFormatter={null}
            onChange={this.onDueDateChange}
          />
          <div className={styles.infos}>
            <span className={`${styles.money} ${styles.block}`}>
              (30 DAYS
              {this.state.currentDateFormat}
              )
            </span>
            <Input
              name="dueDate"
              className={`${styles.inputItem} ${commonStyles.default_input}`}
              key="deuDate"
              size="small"
              suffix="DAYS"
              placeholder="0"
              defaultValue={this.state.dueDate}
              value={this.state.dueDate}
              onChange={(e) => { this.handleDueDateChange(e); }}
            />
          </div>
        </div>
      </div>
    );
  }

  public saveLoan = () => {
    this.props.onSave(this.state.stepDueDate);
  };

  render() {
    return (
      <MyModal visible={this.props.visible} title="BORROW" onCancel={this.props.onCancle}>
        <div className={styles.createModalContent}>
          { this.sliderDate() }
          <div className={styles.buttonWrapper}>
            <Button className={`${styles.CreateButton} ${styles.buttonItem}`} size="large" type="primary" onClick={this.props.approve}>Approve</Button>
            <Button
              className={styles.CreateButton}
              size="large"
              type="primary"
              disabled={!this.props.isApprove}
              onClick={this.saveLoan}
            >
              Save
            </Button>
          </div>
        </div>
      </MyModal>
    );
  }
}

export default CreateModal;
