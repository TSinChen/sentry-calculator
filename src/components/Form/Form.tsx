import React, { useState, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'

const THIS_YEAR = dayjs().year()
const YEAR_OPTIONS = [THIS_YEAR - 1, THIS_YEAR, THIS_YEAR + 1]
const THIS_MONTH = dayjs().month()
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index)
const TODAY = dayjs().hour(0).second(0)
const DEFAULT_MAX_NUMBER = 136
const DEFAULT_PER_DAY = [4, 8]

type Props = {
  setResult: React.Dispatch<React.SetStateAction<string>>
}

const Form = ({ setResult }: Props) => {
  const [maxNumber, setMaxNumber] = useState(DEFAULT_MAX_NUMBER)
  const [year, setYear] = useState(THIS_YEAR)
  const [month, setMonth] = useState(THIS_MONTH)
  const [date, setDate] = useState(TODAY.date())
  const [startFirstNumber, setStartFirstNumber] = useState(1)
  const [perDay, setPerDay] = useState(DEFAULT_PER_DAY[1])
  const [userNumber, setUserNumber] = useState(1)
  const [dischargedNumberInput, setDischargedNumberInput] = useState('')
  const dischargedNumber = useMemo(
    () =>
      dischargedNumberInput
        .trimEnd()
        .split(' ')
        .map((number) => Number(number)),
    [dischargedNumberInput],
  )

  const dateOptions = useMemo(
    () =>
      Array.from(
        {
          length: dayjs().month(month).daysInMonth(),
        },
        (_, index) => index,
      ),
    [month],
  )

  const handleSubmit = () => {
    const startDate = dayjs().year(year).month(month).date(date)
    if (startDate.day() === 5 || startDate.day() === 6) {
      alert('請選擇週五及週六以外的日期！')
      return
    }
    let count = 0
    for (let i = startFirstNumber; i !== userNumber; i++) {
      if (dischargedNumber.includes(i)) {
        continue
      }
      if (i > maxNumber) {
        i = 0
      } else {
        count++
      }
    }
    const dayCount = Math.trunc(count / perDay)
    const sequenceCount = count % perDay
    let countedDate = startDate
    for (let i = 1; i <= dayCount; i++) {
      countedDate = countedDate.add(1, 'day')
      if (countedDate.day() === 5) {
        countedDate = countedDate.add(2, 'day')
      }
    }
    setResult(
      `${userNumber} 號下一次站哨是在 ${countedDate.format('YYYY 年 MM 月 DD 日')}第 ${sequenceCount + 1} 班`,
    )
  }

  useEffect(() => {
    setMaxNumber(Number(localStorage.getItem('maxNumber')) || DEFAULT_MAX_NUMBER)
    setUserNumber(Number(localStorage.getItem('userNumber')))
    setDischargedNumberInput(localStorage.getItem('dischargedNumberInput') || '')
  }, [])

  useEffect(() => {
    localStorage.setItem('maxNumber', String(maxNumber))
  }, [maxNumber])

  useEffect(() => {
    localStorage.setItem('userNumber', String(userNumber))
  }, [userNumber])

  useEffect(() => {
    localStorage.setItem('dischargedNumberInput', dischargedNumberInput)
  }, [dischargedNumberInput])

  return (
    <form className="form">
      <div className="form__block">
        <label className="form__block__label" htmlFor="maxNumber">
          連最大學號
        </label>
        <div className="form__block__inputs">
          <input
            className="form__block__inputs__input"
            id="maxNumber"
            value={maxNumber}
            onChange={(e) => setMaxNumber(Number(e.target.value))}
            type="number"
            min={1}
            max={999}
          />
        </div>
      </div>
      <div className="form__block">
        <label className="form__block__label" htmlFor="year">
          計算起始日
        </label>
        <div className="form__block__inputs">
          <select
            className="form__block__inputs__input"
            id="year"
            name="year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          年
          <select
            className="form__block__inputs__input"
            name="month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTH_OPTIONS.map((month) => (
              <option key={month} value={month}>
                {month + 1}
              </option>
            ))}
          </select>
          月
          <select
            className="form__block__inputs__input"
            name="date"
            value={date}
            onChange={(e) => setDate(Number(e.target.value))}
          >
            {dateOptions.map((date) => (
              <option key={date}>{date + 1}</option>
            ))}
          </select>
          日
        </div>
      </div>
      <div className="form__block">
        <label className="form__block__label" htmlFor="todayFirstNumber">
          計算起始日第一班學號
        </label>
        <div className="form__block__inputs">
          <select
            className="form__block__inputs__input"
            id="todayFirstNumber"
            value={startFirstNumber}
            onChange={(e) => setStartFirstNumber(Number(e.target.value))}
          >
            {Array.from({ length: maxNumber }).map((_, index) => (
              <option key={Math.random()} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form__block">
        <label className="form__block__label" htmlFor="perDay">
          每日班數
        </label>
        <div className="form__block__inputs">
          <select
            className="form__block__inputs__input"
            id="perDay"
            value={perDay}
            onChange={(e) => setPerDay(Number(e.target.value))}
          >
            {DEFAULT_PER_DAY.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form__block">
        <label className="form__block__label" htmlFor="userNumber">
          你的學號
        </label>
        <div className="form__block__inputs">
          <select
            className="form__block__inputs__input"
            id="userNumber"
            value={userNumber}
            onChange={(e) => setUserNumber(Number(e.target.value))}
          >
            {Array.from({ length: maxNumber }).map((_, index) => (
              <option key={Math.random()} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form__block">
        <label className="form__block__label" htmlFor="dischargedNumberInput">
          已退伍學號
        </label>
        <div className="form__block__inputs">
          <input
            className="form__block__inputs__input"
            placeholder="每個學號以半形空格區隔"
            id="dischargedNumberInput"
            value={dischargedNumberInput}
            onChange={(e) => setDischargedNumberInput(e.target.value)}
          />
        </div>
      </div>
      <div className="form__submit" onClick={handleSubmit}>
        計算
      </div>
    </form>
  )
}

export default Form
