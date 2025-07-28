import { useState } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useToast } from '../../../../context/jungeun/ToastContext';

const ChargeCalculator = (userCurrentPoint) => {
    const [paymentAmount, setPaymentAmount] = useState('');
    const [currentBalance, setCurrentBalance] = useState(userCurrentPoint);
    const [cmRate, setCmRate] = useState(1); // CM 적용율
    const [vatRate, setVatRate] = useState(0.1); // VAT 10%
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { source } = useParams();
    const safeSource = source || 'deault';
    const basePath = process.env.NODE_ENV === 'production' ? '/react' : '';
    // 결제 금액 계산
    const calculatePaymentDetails = () => {
        const amount = parseFloat(paymentAmount) || 0;
        const vatAmount = amount * vatRate;
        const totalPayment = amount + vatAmount;
        const cmToCharge = amount * cmRate;
        const newBalance = currentBalance + cmToCharge;
        return {
            vatAmount,
            totalPayment,
            cmToCharge,
            newBalance
        };
    };
    // 카드결제 처리
    const handleCardPayment = async () => {
        if (!paymentAmount || parseFloat(paymentAmount) < 1000) {
            showToast('error', '최소 결제 금액은 1,000원입니다.');
            return;
        }
        try {
            // 토스페이먼츠 SDK 초기화
            const clientKey = process.env.REACT_APP_TOSS_JiHUN_CLIENT_KEY;
            const tossPayments = await loadTossPayments(clientKey);
            // 결제 위젯 렌더링
            await tossPayments.requestPayment('카드',{
                amount: Number(parseFloat(totalPayment)),
                orderId: `order_${Date.now()}_${crypto.randomUUID()}`,
                orderName: '택준이 팝니다.',
                customerName: JSON.parse(localStorage.getItem('user-info')).name,
                customerEmail: JSON.parse(localStorage.getItem('user-info')).email,
                successUrl: `${window.location.origin}${basePath}/charge/result?source=${safeSource}`,
                failUrl: `${window.location.origin}${basePath}/charge/result?source=${safeSource}`,
                card: {
                    useEscrow: false,
                    flowMode: "DEFAULT",
                    useCardPoint: false,
                    useAppCardOnly: false,
                },
            });
        } catch (error) {
            if (error.code === 'USER_CANCEL') {

            }else{
                console.error('Payment 결제 실패:', error);
                showToast('error', '결제창을 열 수 없습니다. 다시 시도해주세요.');
            }
        }
    };

    const { vatAmount, totalPayment, cmToCharge, newBalance } = calculatePaymentDetails();

    return {
        paymentAmount,
        setPaymentAmount,
        currentBalance,
        vatAmount,
        totalPayment,
        cmToCharge,
        newBalance,
        cmRate,
        handleCardPayment
    };
};

export default ChargeCalculator; 