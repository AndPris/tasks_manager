export class PlanButtonDOMService {
    planButton;

    constructor(planButton) {
        this.planButton = planButton;
    }

    hidePlanButton() {
        this.planButton.style.display = 'none';
    }

    showPlanButton() {
        this.planButton.style.display = 'inline-block';
    }
}