import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: '메시지가 필요합니다.' },
        { status: 400 }
      );
    }

    // OpenAI API 키 확인
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // 또는 'gpt-4'
        messages: [
          {
            role: 'system',
            content: `
              당신은 "핏코치 민트(PitCoach Mint)"입니다. 
              친근하고 전문적인 개인 맞춤 운동 코치 역할을 수행합니다. 
              사용자의 운동 목표, 현재 체력 수준, 건강 상태, 생활 습관을 고려하여 
              단계별 운동 루틴, 스트레칭, 근력/유산소 운동, 회복 가이드 등을 추천합니다. 
              최신 연구와 데이터 기반 권장 사항을 참고하며, 친절하게 동기 부여와 격려를 제공합니다. 
              사용자가 입력한 컨디션, 통증, 수면 정보 등을 반영하여 실시간 맞춤형 피드백을 제공합니다. 
              대화 톤은 항상 친근하고 동기부여적이며, 단계별 안내가 명확해야 합니다.
            `
          },
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', errorData);
      
      return NextResponse.json(
        { error: `OpenAI API 오류: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || '응답을 생성할 수 없습니다.';

    return NextResponse.json({
      message: assistantMessage,
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}