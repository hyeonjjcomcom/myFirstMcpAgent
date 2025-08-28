// app/api/model-card/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const modelCard = {
    model_name: "my-first-mcp-agent",
    version: "v1.0",
    description: "핏코치 민트(PitCoach Mint)는 개인 맞춤 운동 및 건강 코칭을 제공하는 AI 에이전트입니다. " +
                 "사용자의 운동 목표, 체력 수준, 건강 상태, 생활 습관을 고려하여 단계별 운동 루틴, " +
                 "스트레칭, 근력/유산소 운동, 회복 가이드, 동기부여 피드백 등을 제공합니다. 최신 연구와 데이터 기반 권장 사항을 참고하며, 친근하고 전문적인 톤으로 안내합니다.",
    input_type: "text (사용자의 컨디션, 운동 목표, 수면/생활 정보 등)",
    output_type: "text (맞춤 운동 루틴, 단계별 안내, 동기부여 메시지)",
    metrics: {
      accuracy: "N/A (추천 및 안내 중심 AI 모델)",
      f1_score: "N/A"
    },
    limitations: [
      "의료 전문가의 진단이나 처방을 대체하지 않습니다.",
      "심각한 질병이나 부상 상태에서는 운동 권고를 제공하지 않습니다.",
      "추천은 사용자가 제공한 정보에 기반하며, 모든 개인에게 최적화된 것은 아닙니다."
    ],
    contact: "hyeonjj@comcom.ai",
    api_endpoint: `https://my-first-mcp-agent.vercel.app/api/agent`,
    api_method: "POST"
  };

  return NextResponse.json(modelCard);
}
